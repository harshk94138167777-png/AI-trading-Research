const OpenAI = require('openai');

const analyzeTradingQuestion = async (question) => {
  if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
    console.log("No API key found, using mock AI response.");
    return getMockResponse(question);
  }

  // Support OpenRouter if provided, otherwise default to OpenAI
  const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined
  });
  
  const prompt = `
You are an AI Trading Research Assistant. The user will provide a trading research question.
Your task is to extract structured information to define an experiment, and identify any missing or ambiguous information.

Respond ONLY with valid JSON using the exact schema below. Do not include markdown formatting like \`\`\`json.

{
  "instrument": "string or null",
  "timeframe": "string or null",
  "entryCondition": "string or null",
  "exitCondition": "string or null",
  "holdingPeriod": "string or null",
  "filters": ["array of strings"],
  "researchQuestion": "string",
  "hypothesis": "string",
  "missingInformation": [
    {
      "field": "string (e.g., holdingPeriod, exitCondition, entryCondition)",
      "question": "string (The question to ask the user)",
      "options": ["array of suggested string options"]
    }
  ],
  "assumptions": ["array of strings"]
}

Rules:
- Be precise. If something is not mentioned, make it null and add it to missingInformation.
- Do not blindly invent missing values for entry, exit, or holding period.
- For ambiguous terms like "sharp fall", add a missingInformation item for clarification (e.g. "How should 'sharp fall' be defined?").
- Only ask questions that materially affect the experiment.

User Question: "${question}"
`;

  try {
    const modelToUse = process.env.OPENROUTER_API_KEY 
      ? (process.env.OPENAI_MODEL || 'meta-llama/llama-3.1-8b-instruct:free') 
      : (process.env.OPENAI_MODEL || 'gpt-4o-mini');

    const response = await openai.chat.completions.create({
      model: modelToUse,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to process question via AI");
  }
};

const getMockResponse = async (question) => {
  // Simulate network/AI processing delay so the UI loading state is visible
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple deterministic mock based on keywords
  const isNifty = question.toLowerCase().includes('nifty');
  return {
    instrument: isNifty ? 'NIFTY' : 'Unknown',
    timeframe: 'Daily',
    entryCondition: 'NIFTY falls >= 1%',
    exitCondition: null,
    holdingPeriod: null,
    filters: ['High volatility'],
    researchQuestion: 'Does the strategy have a positive edge?',
    hypothesis: 'Buying after a down day in a volatile market yields positive returns.',
    missingInformation: [
      {
        field: 'holdingPeriod',
        question: 'How long should the position be held?',
        options: ['1 day', '3 days', '5 days', '10 days']
      },
      {
        field: 'exitCondition',
        question: 'When should we exit?',
        options: ['At close', 'Stop loss 1%', 'Target 2%']
      }
    ],
    assumptions: ['Slippage is 0.05%']
  };
};

module.exports = {
  analyzeTradingQuestion
};
