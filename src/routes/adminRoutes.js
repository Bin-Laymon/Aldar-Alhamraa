const express = require('express');
const controller = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate, authorize('admin'));
router.get('/summary', controller.summary);
router.patch('/stories/:id/moderate', controller.moderateStory);
router.post('/commission', controller.setCommission);
router.get('/users', controller.getUsers);
router.patch('/users/:id/suspend', controller.suspendUser);
router.patch('/payouts/:id/approve', controller.approvePayout);

module.exports = router;
