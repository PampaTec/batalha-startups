/* ==========================================================================
   Startup Pampa — PampaPay Prototype Application Logic
   ========================================================================== */

// STATE MANAGEMENT
const state = {
  viewer: {
    name: "Ana Silva",
    badge: "1042",
    balance: 1500.0,
    totalInvested: 0.0,
    feedbacksSubmitted: 0
  },
  startups: [
    {
      id: "st-1",
      name: "AgroTech Pampa",
      category: "Agronegócio & IoT",
      desc: "Monitoramento inteligente de lavouras com sensores de solo e drones.",
      pixKey: "agrotech@pampa.pix",
      balance: 4200.0,
      totalInvestors: 18,
      ratingSum: 49,
      ratingCount: 10,
      icon: "🌾",
      withdrawals: []
    },
    {
      id: "st-2",
      name: "SolarPampa",
      category: "Energia Renovável",
      desc: "Plataforma de compartilhamento de energia solar em comunidades rurais.",
      pixKey: "solarpampa@pampa.pix",
      balance: 3600.0,
      totalInvestors: 14,
      ratingSum: 47,
      ratingCount: 10,
      icon: "☀️",
      withdrawals: []
    },
    {
      id: "st-3",
      name: "EduConnect RS",
      category: "EdTech & Capacitação",
      desc: "Gamificação de cursos de empreendedorismo para jovens do Pampa.",
      pixKey: "educonnect@pampa.pix",
      balance: 2800.0,
      totalInvestors: 11,
      ratingSum: 45,
      ratingCount: 10,
      icon: "🎓",
      withdrawals: []
    },
    {
      id: "st-4",
      name: "EcoPack Pampa",
      category: "Biotecnologia & Embalagens",
      desc: "Embalagens biodegradáveis produzidas a partir de resíduos da semente do arroz.",
      pixKey: "ecopack@pampa.pix",
      balance: 1950.0,
      totalInvestors: 8,
      ratingSum: 46,
      ratingCount: 10,
      icon: "🌱",
      withdrawals: []
    }
  ],
  ledger: [],
  receivedPix: {},
  activeStartupId: "st-1",
  eventActive: true,
  timerSeconds: 525
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  seedInitialData();
  renderAllViews();
  startTimer();
});

// NAVIGATION LOGIC
function setupNavigation() {
  const tabs = document.querySelectorAll(".nav-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetView = tab.getAttribute("data-tab");
      document.querySelectorAll(".tab-view").forEach((v) => v.classList.remove("active"));
      document.getElementById(`view-${targetView}`).classList.add("active");
    });
  });
}

// MOCK DATA SEED
function seedInitialData() {
  const now = new Date();
  state.ledger = [
    {
      id: "tx-101",
      timestamp: formatTime(new Date(now - 30 * 60000)),
      type: "Crédito Inicial",
      description: "Resgate de Token QR Code (#1042)",
      amount: 1000.0,
      status: "Concluído",
      isPositive: true
    },
    {
      id: "tx-102",
      timestamp: formatTime(new Date(now - 15 * 60000)),
      type: "Recompensa",
      description: "Avaliação do Pitch • AgroTech Pampa",
      amount: 200.0,
      status: "Concluído",
      isPositive: true
    },
    {
      id: "tx-103",
      timestamp: formatTime(new Date(now - 10 * 60000)),
      type: "Investimento Pix",
      description: "Transferência Pix • AgroTech Pampa",
      amount: 450.0,
      status: "Concluído",
      isPositive: false
    },
    {
      id: "tx-104",
      timestamp: formatTime(new Date(now - 2 * 60000)),
      type: "Recompensa",
      description: "Avaliação do Pitch • SolarPampa",
      amount: 500.0,
      status: "Concluído",
      isPositive: true
    }
  ];

  // Populate startup select inputs
  populateStartupDropdowns();
}

function populateStartupDropdowns() {
  const pixSelect = document.getElementById("pix-target-startup");
  const feedbackSelect = document.getElementById("feedback-target-startup");
  const switcherSelect = document.getElementById("startup-switcher");

  pixSelect.innerHTML = "";
  feedbackSelect.innerHTML = "";
  switcherSelect.innerHTML = "";

  state.startups.forEach((st) => {
    pixSelect.innerHTML += `<option value="${st.id}">${st.name} (${st.category})</option>`;
    feedbackSelect.innerHTML += `<option value="${st.id}">${st.name}</option>`;
    switcherSelect.innerHTML += `<option value="${st.id}">${st.name}</option>`;
  });

  // Bind listener for Pix key display update
  pixSelect.addEventListener("change", (e) => updatePixKeyDisplay(e.target.value));
  updatePixKeyDisplay(state.startups[0].id);
}

function updatePixKeyDisplay(startupId) {
  const st = state.startups.find((s) => s.id === startupId);
  if (st) {
    document.getElementById("pix-key-display").value = st.pixKey;
  }
}

// RENDER VIEWS
function renderAllViews() {
  renderViewerSection();
  renderStartupSection();
  renderLeaderboardSection();
  renderAdminSection();
}

// VIEW 1: VIEWER RENDER
function renderViewerSection() {
  document.getElementById("viewer-balance").innerText = formatCurrency(state.viewer.balance);
  document.getElementById("pix-user-balance-hint").innerText = `$P ${formatCurrency(state.viewer.balance)}`;
  document.getElementById("total-invested-user").innerText = `$P ${formatCurrency(state.viewer.totalInvested)}`;
  document.getElementById("total-feedbacks-user").innerText = state.viewer.feedbacksSubmitted;

  // Render Marketplace
  const grid = document.getElementById("startup-cards-list");
  grid.innerHTML = state.startups
    .map(
      (st) => `
    <div class="startup-card">
      <div class="startup-card-header">
        <div class="startup-icon">${st.icon}</div>
        <div class="startup-details">
          <h4>${st.name}</h4>
          <span class="startup-category">${st.category}</span>
        </div>
      </div>
      <p class="startup-desc">${st.desc}</p>
      <div class="startup-funding-info">
        <span>Arrecadado: <strong>$P ${formatCurrency(st.balance)}</strong></span>
        <span>Avaliação: <strong>${(st.ratingSum / st.ratingCount).toFixed(1)} ★</strong></span>
      </div>
      <button class="btn btn-primary w-full" onclick="quickPix('${st.id}')">
        ⚡ Investir via Pix
      </button>
    </div>
  `
    )
    .join("");

  // Render Ledger
  const ledgerBody = document.getElementById("viewer-ledger-body");
  ledgerBody.innerHTML = state.ledger
    .map(
      (item) => `
    <tr>
      <td>${item.timestamp}</td>
      <td><span class="badge-tag ${item.isPositive ? "green" : "blue"}">${item.type}</span></td>
      <td>${item.description}</td>
      <td class="${item.isPositive ? "val-positive" : "val-negative"}">
        ${item.isPositive ? "+" : "-"}$P ${formatCurrency(item.amount)}
      </td>
      <td><span class="badge-status">${item.status}</span></td>
    </tr>
  `
    )
    .join("");
}

// VIEW 2: STARTUP PORTAL RENDER
function switchStartupPortal(startupId) {
  state.activeStartupId = startupId;
  renderStartupSection();
}

function renderStartupSection() {
  const st = state.startups.find((s) => s.id === state.activeStartupId) || state.startups[0];

  document.getElementById("startup-portal-balance").innerText = formatCurrency(st.balance);
  document.getElementById("withdraw-startup-balance-hint").innerText = `$P ${formatCurrency(st.balance)}`;
  document.getElementById("startup-investors-count").innerText = st.totalInvestors;
  document.getElementById("startup-rating-avg").innerText = `${(st.ratingSum / st.ratingCount).toFixed(1)} ★`;

  // Calculate Rank position
  const sorted = [...state.startups].sort((a, b) => b.balance - a.balance);
  const pos = sorted.findIndex((s) => s.id === st.id) + 1;
  document.getElementById("startup-rank-pos").innerText = `#${pos} Lugar`;

  // Render Received Investments List
  const receivedList = document.getElementById("startup-received-pix-list");
  const startupTxs = state.ledger.filter((l) => l.description.includes(st.name) && !l.isPositive);
  if (startupTxs.length === 0) {
    receivedList.innerHTML = `<div class="list-item">Nenhum investimento Pix recebido ainda.</div>`;
  } else {
    receivedList.innerHTML = startupTxs
      .map(
        (tx) => `
      <div class="list-item">
        <div>
          <strong>${tx.description}</strong>
          <br><small style="color:#64748b">${tx.timestamp}</small>
        </div>
        <span class="val-positive">+$P ${formatCurrency(tx.amount)}</span>
      </div>
    `
      )
      .join("");
  }

  // Render Withdrawals List
  const withdrawList = document.getElementById("startup-withdrawals-list");
  if (st.withdrawals.length === 0) {
    withdrawList.innerHTML = `<div class="list-item">Nenhum resgate efetuado.</div>`;
  } else {
    withdrawList.innerHTML = st.withdrawals
      .map(
        (w) => `
      <div class="list-item">
        <div>
          <strong>Resgate Pix • ${w.pixKey}</strong>
          <br><small style="color:#64748b">${w.timestamp}</small>
        </div>
        <span class="val-negative">-$P ${formatCurrency(w.amount)}</span>
      </div>
    `
      )
      .join("");
  }
}

// VIEW 3: TELÃO LEADERBOARD RENDER
function renderLeaderboardSection() {
  const sorted = [...state.startups].sort((a, b) => b.balance - a.balance);
  const maxBalance = Math.max(...sorted.map((s) => s.balance), 1);

  const container = document.getElementById("telao-ranking-list");
  container.innerHTML = sorted
    .map((st, index) => {
      const rankClass = index === 0 ? "top1" : index === 1 ? "top2" : index === 2 ? "top3" : "";
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
      const percentage = Math.min(100, Math.round((st.balance / maxBalance) * 100));

      return `
      <div class="rank-card ${rankClass}">
        <div class="rank-pos">${medal}</div>
        <div class="rank-info">
          <h3>${st.icon} ${st.name}</h3>
          <span class="rank-meta">${st.category} • ${st.totalInvestors} investidores</span>
          <div class="rank-bar-bg">
            <div class="rank-bar-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
        <div class="rank-amount">
          $P ${formatCurrency(st.balance)}
        </div>
      </div>
    `;
    })
    .join("");

  // Update Ticker
  const ticker = document.getElementById("ticker-messages");
  const recentTxs = state.ledger.slice(0, 5);
  ticker.innerHTML = recentTxs
    .map((tx) => `⚡ [${tx.timestamp}] ${tx.description} — $P ${formatCurrency(tx.amount)}`)
    .join(" &nbsp;&nbsp;&bull;&nbsp;&nbsp; ");
}

// VIEW 4: ADMIN SECTION RENDER
function renderAdminSection() {
  const totalGlobal = state.startups.reduce((acc, s) => acc + s.balance, 0);
  document.getElementById("global-total-invested").innerText = `$P ${formatCurrency(totalGlobal)}`;
  document.getElementById("global-transactions-count").innerText = state.ledger.length;
}

// PIX INVESTMENT MODAL & ACTION
function openPixModal() {
  if (!state.eventActive) return alert("A janela de investimentos Pix foi encerrada!");
  document.getElementById("modal-pix").classList.add("active");
}
function closePixModal() {
  document.getElementById("modal-pix").classList.remove("active");
}

function quickPix(startupId) {
  document.getElementById("pix-target-startup").value = startupId;
  updatePixKeyDisplay(startupId);
  openPixModal();
}

function handlePixSubmit(e) {
  e.preventDefault();
  const startupId = document.getElementById("pix-target-startup").value;
  const amount = parseFloat(document.getElementById("pix-amount").value);
  const msg = document.getElementById("pix-message").value;

  if (amount > state.viewer.balance) {
    alert("Saldo insuficiente na sua carteira!");
    return;
  }

  const st = state.startups.find((s) => s.id === startupId);
  if (!st) return;

  // Execute Transaction
  state.viewer.balance -= amount;
  state.viewer.totalInvested += amount;
  st.balance += amount;
  st.totalInvestors += 1;

  // Record Ledger
  state.ledger.unshift({
    id: `tx-${Date.now()}`,
    timestamp: formatTime(new Date()),
    type: "Investimento Pix",
    description: `Transferência Pix • ${st.name} ${msg ? '(' + msg + ')' : ''}`,
    amount: amount,
    status: "Concluído",
    isPositive: false
  });

  closePixModal();
  renderAllViews();
  alert(`⚡ Pix de $P ${formatCurrency(amount)} enviado com sucesso para ${st.name}!`);
}

// FEEDBACK PITCH MODAL & ACTION
function openFeedbackModal() {
  document.getElementById("modal-feedback").classList.add("active");
}
function closeFeedbackModal() {
  document.getElementById("modal-feedback").classList.remove("active");
}

function handleFeedbackSubmit(e) {
  e.preventDefault();
  const startupId = document.getElementById("feedback-target-startup").value;
  const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
  const comment = document.getElementById("feedback-comment").value;

  const st = state.startups.find((s) => s.id === startupId);
  if (st) {
    st.ratingSum += rating;
    st.ratingCount += 1;
  }

  // Bonus Reward
  const rewardAmount = 200.0;
  state.viewer.balance += rewardAmount;
  state.viewer.feedbacksSubmitted += 1;

  state.ledger.unshift({
    id: `tx-${Date.now()}`,
    timestamp: formatTime(new Date()),
    type: "Recompensa",
    description: `Avaliação de Pitch (${rating}★) • ${st ? st.name : 'Startup'}`,
    amount: rewardAmount,
    status: "Concluído",
    isPositive: true
  });

  closeFeedbackModal();
  renderAllViews();
  alert(`🎉 Avaliação enviada! Você recebeu +$P 200,00 PampaCoins na sua carteira!`);
}

// WITHDRAWAL MODAL & ACTION
function openWithdrawModal() {
  document.getElementById("modal-withdraw").classList.add("active");
}
function closeWithdrawModal() {
  document.getElementById("modal-withdraw").classList.remove("active");
}

function handleWithdrawSubmit(e) {
  e.preventDefault();
  const st = state.startups.find((s) => s.id === state.activeStartupId);
  if (!st) return;

  const amount = parseFloat(document.getElementById("withdraw-amount").value);
  const pixKey = document.getElementById("withdraw-pix-key").value;

  if (amount > st.balance) {
    alert("Saldo insuficiente para resgate!");
    return;
  }

  st.balance -= amount;
  st.withdrawals.unshift({
    timestamp: formatTime(new Date()),
    amount: amount,
    pixKey: pixKey
  });

  closeWithdrawModal();
  renderAllViews();
  alert(`💵 Resgate Pix de $P ${formatCurrency(amount)} enviado para processamento!`);
}

// ADMIN SIMULATION CONTROLS
function simulateRandomPix() {
  for (let i = 0; i < 5; i++) {
    const randomSt = state.startups[Math.floor(Math.random() * state.startups.length)];
    const randomAmount = Math.floor(Math.random() * 5 + 1) * 100;

    randomSt.balance += randomAmount;
    randomSt.totalInvestors += 1;

    state.ledger.unshift({
      id: `tx-sim-${Date.now()}-${i}`,
      timestamp: formatTime(new Date()),
      type: "Investimento Pix",
      description: `Pix Simulado (Espectador #${Math.floor(Math.random() * 800 + 1000)}) • ${randomSt.name}`,
      amount: randomAmount,
      status: "Concluído",
      isPositive: false
    });
  }

  renderAllViews();
  alert("⚡ 5 Investimentos Pix simulados foram adicionados!");
}

function toggleEventState() {
  state.eventActive = !state.eventActive;
  const btnText = document.getElementById("admin-event-btn-text");
  if (state.eventActive) {
    btnText.innerText = "Encerrar Batalha de Startups";
    document.getElementById("event-timer").innerText = "08:45";
    alert("Evento reaberto para investimentos.");
  } else {
    btnText.innerText = "Reabrir Batalha de Startups";
    document.getElementById("event-timer").innerText = "ENCERRADO";

    const winner = [...state.startups].sort((a, b) => b.balance - a.balance)[0];
    alert(`🏆 EVENTO ENCERRADO!\n\nGrande Campeã: ${winner.name}\nTotal Arrecadado: $P ${formatCurrency(winner.balance)}`);
  }
  renderAllViews();
}

function resetPrototypeData() {
  state.viewer.balance = 1500.0;
  state.viewer.totalInvested = 0.0;
  state.viewer.feedbacksSubmitted = 0;
  state.startups[0].balance = 4200.0;
  state.startups[1].balance = 3600.0;
  state.startups[2].balance = 2800.0;
  state.startups[3].balance = 1950.0;
  seedInitialData();
  renderAllViews();
  alert("Dados do protótipo resetados!");
}

// TIMER TICK
function startTimer() {
  setInterval(() => {
    if (state.eventActive && state.timerSeconds > 0) {
      state.timerSeconds--;
      const min = String(Math.floor(state.timerSeconds / 60)).padStart(2, "0");
      const sec = String(state.timerSeconds % 60).padStart(2, "0");
      document.getElementById("event-timer").innerText = `${min}:${sec}`;
    }
  }, 1000);
}

// HELPER FORMATTERS
function formatCurrency(val) {
  return val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatTime(date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
