const storyModel = require('../models/storyModel');
const reviewModel = require('../models/reviewModel');
const { AppError } = require('../utils/errors');
const { toStoragePath } = require('../services/storageService');

async function createStory(req, res, next) {
  try {
    if (!req.files?.pdf?.[0] || !req.files?.cover?.[0]) {
      throw new AppError('PDF and cover image are required', 400);
    }

    const story = await storyModel.createStory({
      writerId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      language: req.body.language || 'en',
      isFeatured: req.body.isFeatured === 'true',
      coverImagePath: toStoragePath(req.files.cover[0].filename, 'covers'),
      filePath: toStoragePath(req.files.pdf[0].filename, 'stories')
    });

    res.status(201).json(story);
  } catch (err) {
    next(err);
  }
}

async function listMarketplace(req, res, next) {
  try {
    const stories = await storyModel.listMarketplaceStories({
      category: req.query.category,
      maxPrice: req.query.maxPrice,
      sort: req.query.sort
    });
    res.json(stories);
  } catch (err) {
    next(err);
  }
}

async function getStory(req, res, next) {
  try {
    const story = await storyModel.getStoryById(req.params.id);
    if (!story) throw new AppError('Story not found', 404);
    const reviews = await reviewModel.listReviews(req.params.id);
    res.json({ ...story, reviews });
  } catch (err) {
    next(err);
  }
}

async function myStories(req, res, next) {
  try {
    const stories = await storyModel.listWriterStories(req.user.id);
    res.json(stories);
  } catch (err) {
    next(err);
  }
}

async function updateStory(req, res, next) {
  try {
    const story = await storyModel.updateStory(req.params.id, req.user.id, req.body);
    if (!story) throw new AppError('Story not found or no updates', 404);
    res.json(story);
  } catch (err) {
    next(err);
  }
}

async function removeStory(req, res, next) {
  try {
    const removed = await storyModel.deleteStory(req.params.id, req.user.id);
    if (!removed) throw new AppError('Story not found', 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function addReview(req, res, next) {
  try {
    const review = await reviewModel.addReview({
      storyId: req.params.id,
      userId: req.user.id,
      rating: Number(req.body.rating),
      comment: req.body.comment
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createStory,
  listMarketplace,
  getStory,
  myStories,
  updateStory,
  removeStory,
  addReview
};
