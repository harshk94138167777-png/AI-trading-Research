# AI Trading Research Assistant Mini Prototype

A focused, AI-native research assistant that translates natural-language trading ideas into structured backtest experiments.

## Architecture
The application is built using a decoupled client-server architecture to ensure scalability and clean separation of concerns:
- **Frontend (Client):** A React single-page application that manages a rigorous state machine (ASK → UNDERSTAND → CLARIFY → DEFINE → TEST → LEARN). It handles the complex UI transitions, dynamic forms for ambiguity resolution, and data visualization.
- **Backend (Server):** A Node.js Express API that serves as the logic and orchestration layer. It exposes endpoints for AI analysis (`/api/analyze`), experiment definition (`/api/experiment`), and mock testing (`/api/test`). 
- **AI Service Layer:** The backend interacts with LLMs using a strict structured JSON schema, ensuring the frontend never has to parse unpredictable free-form text. A deterministic mock fallback is provided if no API key is present.
- **Mock Backtest Engine:** A deterministic math layer in the backend that generates realistic, consistent mock distributions based on the parsed parameters.

## Technology Choices
- **Frontend:** React + Vite + Tailwind CSS v4. Chosen for rapid UI development, excellent developer experience, and modern, highly responsive design capabilities. *Recharts* was used for rendering the mock data distribution because of its robust, declarative API.
- **Backend:** Node.js + Express.js. Chosen for lightweight, fast API development and seamless JSON handling across the full JavaScript stack.
- **AI Integration:** OpenAI SDK structure, utilizing structured output requirements to enforce schema matching.

## Key Assumptions
- **User Intent:** Assumes the user wants to test directional trading edges (not complex options strategies or portfolio balancing).
- **Data Availability:** Assumes the system will eventually have access to daily timeframe historical data (the prototype currently runs on deterministic mock data).
- **Ambiguity Handling:** Assumes it is better to halt the user and force them to explicitly clarify ambiguous terms (e.g., "sharp fall") rather than having the AI hallucinate or invent invisible assumptions.
- **Execution:** This is strictly a research and backtesting tool; no live trading or broker integration assumptions are made.

## How to run the project

### Prerequisites
- Node.js installed on your machine.

### 1. Start the Backend
1. Open a terminal and navigate to `backend/`
2. Run `npm install`
3. Run `npm start` (or `node server.js`)
4. The server will start on `http://localhost:5000`
*Note: To use a live LLM, add `OPENAI_API_KEY=your_key` to a `backend/.env` file. Without it, the backend uses a sophisticated mock engine that still allows you to test the full clarification workflow.*

### 2. Start the Frontend
1. Open a new terminal and navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev`
4. The frontend will be available at `http://localhost:5173`

## AI Tools Used
- **Cursor / LLM Coding Assistants:** Used to accelerate boilerplate generation, Tailwind CSS styling, and Recharts integration.
- **OpenAI (or Mock Fallback):** Used in the backend to parse natural language into structured JSON objects representing trading parameters.

## What you would improve next
- **Live Data Integration:** Connect to a real market data API (e.g., Alpaca, Polygon.io) to run actual backtests instead of deterministic mocks.
- **Custom Timeframes & Assets:** Expand the schema to support crypto, forex, and intraday minute-level timeframes.
- **Vector DB / RAG:** Store past successful experiments in a vector database so the AI can suggest improvements based on historical edge discovery.
- **Advanced Visualizations:** Include equity curve charts and drawdown heatmaps in the results view.
