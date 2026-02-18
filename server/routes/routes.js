import express from 'express';
import { registerUser, loginUser, getAllUsers, getUser, updateUser, changeAvatar, followUnfollowUser  } from '../controllers/userController.js'; 
import { createPost, getPost, getAllPosts, updatePost, deletePost, getUserBookmarks, createBookmarkPost, likeDislikePost, getFollowingPosts, getUserPosts } from '../controllers/postContorller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

  
const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/bookmarks', authMiddleware, getUserBookmarks);
router.get('/users/:id', authMiddleware, getUser);
router.get('/users', getAllUsers);
router.patch('/users/edit/:id', authMiddleware, updateUser);
router.post('/users/change-avatar', authMiddleware, changeAvatar);
router.post('/users/:id/follow-unfollow', authMiddleware, followUnfollowUser);
router.get('/users/:id/posts',getUserPosts);

// POST ROUTES
router.post('/posts',authMiddleware, createPost);
router.get('/posts/following',authMiddleware, getFollowingPosts);
router.get('/posts/:id', authMiddleware, getPost);
router.get('/posts',authMiddleware,  getAllPosts);
router.patch('/posts/edit/:id', authMiddleware, updatePost);
router.delete('/posts/delete/:id', authMiddleware, deletePost);
router.get('/posts/:id/like', authMiddleware, likeDislikePost);
router.get('/posts/:id/bookmark', authMiddleware, createBookmarkPost)

export default router;

// paused @ 46:23 part 2 youtube video