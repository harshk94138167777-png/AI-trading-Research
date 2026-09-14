const runMockTest = async (experiment) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Deterministic mock generation based on string lengths and char codes
  // so the same experiment gets consistent results
  const seed = (experiment.instrument || 'NIFTY').length + (experiment.holdingPeriod || '').length;
  
  const occurrences = 50 + (seed * 5); // 50 to 100+
  const winRate = 0.45 + ((seed % 15) / 100); // 45% to 60%
  const wins = Math.floor(occurrences * winRate);
  const losses = occurrences - wins;
  
  const avgReturn = ((seed % 10) * 0.1) + 0.1; // 0.1% to 1.0%
  
  // Generate some distribution for chart
  const distribution = [];
  for(let i=0; i<10; i++) {
     // A simple bell curve-ish mock distribution
     const bucket = -2.5 + (i * 0.5); 
     const count = Math.floor(Math.sin((i/10) * Math.PI) * (occurrences / 3)) + (i % 3);
     distribution.push({ bucket: `${bucket.toFixed(1)}%`, count });
  }

  return {
    metrics: {
      occurrences,
      wins,
      losses,
      winRate: (winRate * 100).toFixed(1) + '%',
      avgReturn: `+${avgReturn.toFixed(2)}%`,
      medianReturn: `+${(avgReturn * 0.9).toFixed(2)}%`,
      sampleSize: `${occurrences} events`
    },
    chartData: {
      distribution
    },
    aiInterpretation: {
      conclusion: avgReturn > 0.5 
        ? "The sample suggests a potentially positive relationship, but the evidence is not sufficient to establish a reliable trading edge."
        : "The sample does not demonstrate a strong edge. The average return is low and the win rate is close to a coin flip.",
      nextSteps: [
        "Test a different holding period.",
        "Compare high-volatility vs low-volatility periods.",
        "Include realistic transaction costs."
      ]
    }
  };
};

module.exports = {
  runMockTest
};
