const express = require('express');

const postController = require('../controllers/post');

const router = express.Router();

router.get('/posts', postController.getPosts);

router.post('/add-post', postController.postAddPost);

router.get('/posts/:postId', postController.getPost);

router.post('/delete-post', postController.postDeletePost);

router.post('/add-comment', postController.postAddComment);

router.post('/like-post', postController.postLike);

router.post('/dislike-post', postController.postDislike);

module.exports = router;