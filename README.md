
# Chess LLM App

A web-based chess application where a human plays against an AI powered by Large Language Models (LLMs) instead of traditional chess engines.

## Features

- Fully functional chess game with all standard rules
- Support for human vs. human gameplay
- Support for human vs. LLM gameplay
- Integration with multiple LLM providers (Gemini, OpenAI, etc.)
- Move validation and highlighting
- Game state tracking (check, checkmate, stalemate)
- Move history display
- Pawn promotion
- Last move highlighting

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/chess-llm-app.git
cd chess-llm-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## How to Play

1. Choose the game mode (human vs. human or human vs. LLM)
2. If playing against an LLM, choose your preferred LLM provider and enter your API key
3. White always moves first
4. Click on a piece to select it, then click on a highlighted square to make a move
5. For human vs. LLM mode, after you make a move, the LLM will analyze the board and respond with its own move

## LLM Integration

This app currently supports the following LLM providers:
- Google Gemini
- OpenAI GPT
- Cohere
- Claude (Anthropic)

To use an LLM, you'll need to:
1. Select the LLM provider from the dropdown
2. Enter your API key for that provider
3. Your API key is only used for direct API requests and is never stored

## Project Structure

```
chess-llm-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Board.jsx
│   │   ├── Piece.jsx
│   │   ├── Square.jsx
│   │   ├── GameControls.jsx
│   │   ├── GameInfo.jsx
│   │   ├── PromotionModal.jsx
│   │   └── ApiKeyModal.jsx
│   ├── hooks/
│   │   └── useChessGame.js
│   ├── services/
│   │   ├── chessLogic.js
│   │   └── llmService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Credits

Built for BharatX Tech Intern 1st Task


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
