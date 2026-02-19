const express = require('express');
const controller = require('../controllers/storyController');
const upload = require('../middleware/uploadMiddleware');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/writer/mine/all', authenticate, authorize('writer'), controller.myStories);
router.post(
  '/writer',
  authenticate,
  authorize('writer'),
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  controller.createStory
);
router.patch('/writer/:id', authenticate, authorize('writer'), controller.updateStory);
router.delete('/writer/:id', authenticate, authorize('writer'), controller.removeStory);

router.get('/', controller.listMarketplace);
router.get('/:id', controller.getStory);
router.post('/:id/reviews', authenticate, authorize('reader'), controller.addReview);

module.exports = router;
