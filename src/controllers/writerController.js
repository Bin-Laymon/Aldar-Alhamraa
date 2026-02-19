const { getWriterDashboard } = require('../services/analyticsService');
const payoutModel = require('../models/payoutModel');

async function dashboard(req, res, next) {
  try {
    const [stats, payouts] = await Promise.all([
      getWriterDashboard(req.user.id),
      payoutModel.listWriterPayouts(req.user.id)
    ]);
    res.json({ stats, payouts });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard };
