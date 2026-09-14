# Thinking Note: AI Trading Research Assistant

## 1. Product Philosophy & Ambiguity Handling
The core challenge in building an AI trading tool is that financial markets are unforgiving of assumptions. If an AI silently assumes that a "sharp drop" means a 1% decline, but the user meant a 3% decline, the resulting backtest is entirely useless and potentially dangerous.

Therefore, the primary product decision was to **treat the AI not as an omniscient oracle, but as a rigorous junior quantitative researcher.** 

When the user enters a natural language query, the system’s primary job is to extract variables into a strict schema. The critical inflection point happens during the `CLARIFY` stage. If the AI detects ambiguity (e.g., missing holding periods or undefined adjectives), the state machine halts. It deliberately forces the user to resolve the ambiguity through a structured UI (radio buttons and custom inputs) before it allows the experiment definition to proceed. This ensures the user is always in control of the exact parameters being tested.

## 2. Separation of Data and Interpretation
A major pitfall of many AI wrappers is conflating raw data with AI opinions. To counter this, the `LEARN` stage of the application strictly compartmentalizes the output:
- **The Data Layer:** Displays hard, indisputable mock statistics (Win Rate, Occurrences, Average Return) and a visual distribution chart.
- **The Interpretation Layer:** Clearly segregated below the data, where the AI offers its subjective analysis ("What we can reasonably conclude") and suggests iterative next steps.

This visual and architectural separation builds trust, ensuring the user knows exactly what the math says versus what the AI infers.

## 3. UI/UX and Aesthetic Choices
Trading applications demand a premium, high-density, and highly readable interface. I opted for a dark, sleek "fintech" aesthetic utilizing a `slate-950` background with vibrant `cyan` and `emerald` accents.
- **Dynamic Progression:** The glowing arrow mechanics in the progress tracker aren't just for show; they visually pull the user through the 6-stage pipeline, highlighting where their input is required.
- **Glassmorphism:** Using translucent layers and background gradients (like the abstract SVG stock chart) gives the application a modern, native-app feel, far removed from standard text-based chat interfaces.

## 4. Engineering Decisions
- **Decoupled Architecture:** Despite being a prototype, I split the application into a React frontend and an Express backend. This mirrors production realities where the AI parsing and heavy quantitative lifting must happen on secure backend servers, not in the client's browser.
- **Structured JSON Over Chat:** The backend explicitly commands the LLM to return data matching a predefined JSON schema. The frontend React application never touches raw AI text; it purely consumes JSON to map state. This makes the frontend completely deterministic and immune to prompt injection or unpredictable AI verbosity.
- **Deterministic Mocking:** To satisfy the requirement of running without live brokerage APIs, the `backtestService` generates metrics deterministically based on the string lengths of the input parameters. This allows for consistent demonstrations (the same question yields the same mock graph) without the overhead of maintaining local historical databases for a prototype.
