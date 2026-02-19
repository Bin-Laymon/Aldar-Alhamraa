const express = require('express');
const controller = require('../controllers/writerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', authenticate, authorize('writer'), controller.dashboard);

module.exports = router;
