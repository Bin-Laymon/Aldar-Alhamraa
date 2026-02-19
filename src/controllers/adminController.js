const storyModel = require('../models/storyModel');
const userModel = require('../models/userModel');
const payoutModel = require('../models/payoutModel');
const commissionModel = require('../models/commissionModel');
const { getAdminSummary } = require('../services/analyticsService');

async function moderateStory(req, res, next) {
  try {
    const story = await storyModel.moderateStory(req.params.id, req.body.status);
    res.json(story);
  } catch (err) {
    next(err);
  }
}

async function setCommission(req, res, next) {
  try {
    const config = await commissionModel.setCommission(Number(req.body.percent), req.user.id);
    res.json(config);
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function suspendUser(req, res, next) {
  try {
    const updated = await userModel.updateUserSuspension(req.params.id, Boolean(req.body.isSuspended));
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function approvePayout(req, res, next) {
  try {
    const payout = await payoutModel.approvePayout(req.params.id, req.user.id);
    res.json(payout);
  } catch (err) {
    next(err);
  }
}

async function summary(req, res, next) {
  try {
    const data = await getAdminSummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  moderateStory,
  setCommission,
  getUsers,
  suspendUser,
  approvePayout,
  summary
};
