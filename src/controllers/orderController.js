const orderModel = require('../models/orderModel');
const storyModel = require('../models/storyModel');
const userModel = require('../models/userModel');
const commissionModel = require('../models/commissionModel');
const transactionModel = require('../models/transactionModel');
const paymentService = require('../services/paymentService');
const { signDownloadToken, verifyDownloadToken } = require('../utils/jwt');
const env = require('../config/env');
const { AppError } = require('../utils/errors');
const { generateWatermarkedPdf } = require('../services/watermarkService');
const { resolveStoragePath } = require('../services/storageService');

async function purchaseStory(req, res, next) {
  try {
    const story = await storyModel.getStoryById(req.body.storyId);
    if (!story || story.status !== 'approved') throw new AppError('Story unavailable', 404);

    const commission = await commissionModel.getCurrentCommission();
    const commissionPercent = commission?.percent ?? env.defaultCommissionPercent;

    const order = await orderModel.createOrder({
      userId: req.user.id,
      storyId: story.id,
      amount: Number(story.price),
      commissionPercent
    });

    const payment = await paymentService.charge({
      amount: Number(story.price),
      metadata: { orderId: order.id, storyId: story.id }
    });

    const paidOrder = await orderModel.markOrderPaid(order.id, payment.id);
    await transactionModel.createTransaction({
      orderId: paidOrder.id,
      userId: req.user.id,
      amount: paidOrder.amount,
      provider: 'stripe',
      status: 'paid',
      providerRef: payment.id
    });

    res.status(201).json(paidOrder);
  } catch (err) {
    next(err);
  }
}

async function myOrders(req, res, next) {
  try {
    const orders = await orderModel.listReaderOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function createDownloadLink(req, res, next) {
  try {
    const order = await orderModel.getOrderById(req.params.orderId);
    if (!order || order.user_id !== req.user.id) throw new AppError('Order not found', 404);
    if (order.status !== 'paid') throw new AppError('Order not paid', 400);
    if (order.download_count >= env.maxDownloadsPerPurchase) {
      throw new AppError('Download limit reached', 403);
    }

    const token = signDownloadToken({ orderId: order.id, userId: req.user.id });
    res.json({ url: `${env.baseUrl}/api/orders/download/${token}` });
  } catch (err) {
    next(err);
  }
}

async function downloadPurchasedFile(req, res, next) {
  try {
    const payload = verifyDownloadToken(req.params.token);
    const order = await orderModel.getOrderById(payload.orderId);
    if (!order || order.user_id !== payload.userId) throw new AppError('Invalid token', 401);
    if (order.download_count >= env.maxDownloadsPerPurchase) {
      throw new AppError('Download limit reached', 403);
    }

    const [story, buyer] = await Promise.all([
      storyModel.getStoryById(order.story_id),
      userModel.findUserByEmail(req.user.email)
    ]);

    const watermarkedPath = await generateWatermarkedPdf({
      sourcePath: resolveStoragePath(story.file_path),
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      orderId: order.id
    });

    await orderModel.incrementDownloadCount(order.id);
    res.download(watermarkedPath, `${story.title}.pdf`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  purchaseStory,
  myOrders,
  createDownloadLink,
  downloadPurchasedFile
};
