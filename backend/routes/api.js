const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const experimentController = require('../controllers/experimentController');

router.get('/health', (req, res) => res.json({ status: 'ok' }));

// AI interpretation & clarification
router.post('/analyze', aiController.analyzeQuestion);

// Process answers to clarifications and finalize experiment
router.post('/experiment', experimentController.createExperiment);

// Run test on mock data
router.post('/test', experimentController.runTest);

module.exports = router;
