const express = require('express');
const controller = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/purchase', authenticate, authorize('reader'), controller.purchaseStory);
router.get('/mine', authenticate, authorize('reader'), controller.myOrders);
router.post('/:orderId/download-link', authenticate, authorize('reader'), controller.createDownloadLink);
router.get('/download/:token', authenticate, authorize('reader'), controller.downloadPurchasedFile);

module.exports = router;
