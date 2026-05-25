<div align="center">

# ⛓️ Algo Assistant

### AI-Powered Chatbot for the Algorand Blockchain

*Create NFTs, fungible tokens, smart contracts & dApps through natural language conversation — powered by Google Gemini AI*

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Algorand](https://img.shields.io/badge/Algorand-000000?style=for-the-badge&logo=algorand&logoColor=white)](https://www.algorand.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🚀 What is Algo Assistant?

Algo Assistant is an AI chatbot that lets anyone interact with the **Algorand blockchain** using plain English. Instead of writing complex Teal/PyTeal smart contract code manually, you describe what you want — and the AI generates the contract, deploys it, and explains every step.

### ✨ Key Features

| Feature | Description |
|---|---|
| 💬 **Natural Language Interface** | Describe your blockchain needs in plain English |
| 🪙 **NFT & Token Creation** | Create Algorand Standard Assets (ASAs) — NFTs and fungible tokens |
| 📜 **Smart Contract Generation** | AI generates Teal/PyTeal smart contracts from your description |
| 🔗 **Algorand Integration** | Direct interaction with Algorand testnet/mainnet via AlgoSDK |
| 🤖 **Gemini AI Backend** | Powered by Google Gemini for intelligent code generation |
| 📝 **Contract Templates** | Pre-built templates for common blockchain operations |
| 🎨 **Modern UI** | Clean, responsive chat interface with syntax-highlighted code output |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Chat UI  │  │ Code Display │  │ Contract View │  │
│  └────┬─────┘  └──────┬───────┘  └───────┬───────┘  │
│       │               │                  │           │
│  ┌────▼───────────────▼──────────────────▼────────┐  │
│  │              AI Service Layer                   │  │
│  │  ┌─────────────┐  ┌────────────────────────┐   │  │
│  │  │ Gemini API  │  │ Contract Generator     │   │  │
│  │  │ (NLP → Code)│  │ (Templates + Custom)   │   │  │
│  │  └─────────────┘  └────────────────────────┘   │  │
│  └────────────────────────┬───────────────────────┘  │
│                           │                          │
│  ┌────────────────────────▼───────────────────────┐  │
│  │           Algorand SDK Integration              │  │
│  │  Testnet / Mainnet · ASA · Smart Contracts      │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, CSS Modules |
| **AI Engine** | Google Gemini API (natural language → smart contract code) |
| **Blockchain** | Algorand SDK, Teal/PyTeal smart contracts |
| **Build Tool** | Vite |
| **Linting** | ESLint with TypeScript rules |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/surendravarikallu/Algo-assistant.git
cd Algo-assistant

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key |

---

## 🧪 Testing

Algo Assistant uses **Jest** with `ts-jest` for unit testing the core services.

To execute tests:
```bash
# Run unit tests
npm run test

# Run tests with code coverage maps
npm run test:coverage
```

For more details on configurations, see the **[Testing Documentation (docs/TESTING.md)](docs/TESTING.md)**.

---

## 📁 Project Structure

```
Algo-assistant/
├── docs/
│   └── TESTING.md         # Testing architecture & configurations
├── src/
│   ├── components/        # React UI components
│   │   ├── Chat.tsx       # Main chat interface
│   │   └── Chat.module.css
│   ├── services/          # Core business logic
│   │   ├── aiService.ts       # Gemini API integration
│   │   ├── contractGenerator.ts # Smart contract generation
│   │   ├── helpService.ts     # Help & documentation
│   │   └── helpService.test.ts # Unit tests for helpService
│   ├── config/            # App configuration
│   ├── templates.ts       # Contract templates
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── sandbox/               # Algorand sandbox configs
├── .env.example           # Environment template
├── jest.config.cjs        # Jest test configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🤝 Use Cases

- **Developers** — Rapidly prototype Algorand smart contracts without deep Teal knowledge
- **Students** — Learn blockchain development through guided AI conversation
- **Creators** — Mint NFTs and tokens on Algorand with zero coding

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built by [Surendra Varikallu](https://surendravarikallu.dev/)**

[![Portfolio](https://img.shields.io/badge/Portfolio-surendravarikallu.dev-5A67D8?style=flat-square)](https://surendravarikallu.dev/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/surendravarikallu)

</div>
