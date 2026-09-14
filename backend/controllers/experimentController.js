const backtestService = require('../services/backtestService');

exports.createExperiment = async (req, res, next) => {
  try {
    const experimentData = req.body;
    // For the prototype, we just pass the refined data back as an "experiment"
    // In a real app, we might save this to a DB and return an ID.
    const experiment = {
      id: Date.now().toString(),
      ...experimentData,
      status: 'defined'
    };
    res.json(experiment);
  } catch (err) {
    next(err);
  }
};

exports.runTest = async (req, res, next) => {
  try {
    const { experiment } = req.body;
    if (!experiment) {
      return res.status(400).json({ error: 'Experiment data is required' });
    }

    const results = await backtestService.runMockTest(experiment);
    res.json(results);
  } catch (err) {
    next(err);
  }
};
