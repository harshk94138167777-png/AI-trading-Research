const aiService = require('../services/aiService');

exports.analyzeQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const analysis = await aiService.analyzeTradingQuestion(question);
    res.json(analysis);
  } catch (err) {
    next(err);
  }
};
