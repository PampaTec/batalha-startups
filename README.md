# ⚔️ Batalha de Startups — PampaTec Invest

Protótipo web do **PampaTec Invest** para a premiação da **Batalha de Startups** do Startup Pampa (PampaTec). Uma plataforma de simulação onde investidores usam moedas virtuais **PampaCoins ($P)** para investir via "Pix" nas startups participantes, avaliar pitches e acompanhar o ranking ao vivo em um telão.

Aplicação 100% estática (HTML + CSS + JavaScript puro), sem backend e sem dependências de build — basta servir os arquivos em qualquer servidor estático.

## 🚀 Acesso rápido

- **Site publicado (GitHub Pages):** https://PampaTec.github.io/batalha-startups/
- **Repositório:** https://github.com/PampaTec/batalha-startups

## ✨ Funcionalidades

| Visão | Descrição |
| --- | --- |
| 📱 **Investidor (Pix)** | Carteira digital com PampaCoins, investimento simulado via Pix nas startups, avaliação de pitches (+$P 200 por envio) e extrato de transações (livro razão). |
| 🚀 **Portal Startup** | Saldo de capital arrecadado, métricas de investidores, avaliação média e posição no ranking, com histórico de Pix recebidos e solicitação de resgates. |
| 📊 **Ranking Telão** | Leaderboard ao vivo com pódio (🥇🥈🥉), barras de progresso, cronômetro do evento e ticker de "últimos Pix". |
| ⚙️ **Admin** | Encerrar/reabrir o evento, simular 5 Pix aleatórios de investidores e resetar todos os dados do protótipo. |

## 🏢 Startups participantes

| Startup | Categoria |
| --- | --- |
| 🌾 AgroTech Pampa | Agronegócio & IoT |
| ☀️ SolarPampa | Energia Renovável |
| 🎓 EduConnect RS | EdTech & Capacitação |
| 🌱 EcoPack Pampa | Biotecnologia & Embalagens |

## 🧰 Tecnologias

- HTML5 semântico
- CSS3 (design system próprio, tema claro + dark theme para o telão)
- JavaScript vanilla (ES6+) — estado em memória, sem frameworks
- Google Fonts (Inter + Plus Jakarta Sans)

## ▶️ Como rodar localmente

Qualquer servidor estático funciona. Exemplos:

**Com Python:**
```bash
python3 -m http.server 8080
# acesse http://localhost:8080
```

**Com Node.js (npx):**
```bash
npx serve .
```

**Direto no navegador:** abra o arquivo `index.html` (alguns recursos dependem de ferramentas de desenvolvedor abertas).

## 📁 Estrutura do projeto

```
.
├── index.html      # Interface da aplicação (4 visões + modais)
├── styles.css      # Estilos e tema visual
├── app.js          # Lógica do protótipo (estado, transações, renderização)
└── README.md
```

## ⚠️ Observações

- Os dados são mantidos **apenas em memória** — ao recarregar a página, o estado retorna ao seed inicial.
- Todos os Pix e resgates são **simulados**; não há integração com sistemas de pagamento reais.
- O painel Admin permite `Resetar Dados do Protótipo` para restaurar os valores iniciais do seed.

## 📄 Licença

Projeto de demonstração/apresentação do ecossistema **Startup Pampa — PampaTec**.