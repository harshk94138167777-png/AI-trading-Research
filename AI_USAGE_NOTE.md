# AI Usage Note

## How AI was utilized in the development of this prototype:

1. **Architecture & Scaffolding:**
   AI coding assistants (like Cursor/Gemini) were used to rapidly scaffold the initial project structure, including setting up the Vite + React frontend and the Node.js + Express backend. 

2. **UI & Tailwind Styling:**
   AI was utilized to accelerate the implementation of the complex Tailwind CSS v4 styling. Specifically, iterating through prompts to refine the "premium dark fintech theme," generating the glassmorphic effects, the glowing SVG background chart, and the complex state-driven animations for the progress tracker arrows.

3. **Data Visualization (Recharts):**
   AI assisted in correctly mapping the mock distribution data to the Recharts library, configuring the custom tooltips, grid lines, and conditional coloring (green for positive returns, red for negative returns) to ensure a polished look.

4. **Debugging:**
   AI was used to troubleshoot and resolve versioning conflicts when upgrading to the new Tailwind CSS v4 paradigm and fixing PostCSS build errors.

5. **Mock Logic Generation:**
   AI helped author the deterministic math logic inside `backtestService.js` to ensure the mock data generated realistic-looking bell curves and consistent win rates based on string-length seeds, fulfilling the requirement for a robust demo environment without needing live market data.

*Note: While AI drastically increased development speed, all architectural decisions (such as strictly enforcing structured JSON, decoupling the frontend state machine from raw AI text, and the UX philosophy of halting for clarification) were deliberate, human-driven product choices designed to fulfill the prompt's specific requirements.*
