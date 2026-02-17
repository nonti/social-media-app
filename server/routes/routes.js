import express from 'express';
import { registerUser, loginUser, getAllUsers, getUser, updateUser, changeAvatar, followUnfollowUser  } from '../controllers/userController.js'; 
import { authMiddleware } from '../middlewares/authMiddleware.js';
  
  
const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/:id', authMiddleware, getUser);
router.get('/users', getAllUsers);
router.patch('/users/edit/:id', authMiddleware, updateUser);
router.post('/users/change-avatar', authMiddleware, changeAvatar);
router.post('/users/:id/follow-unfollow', authMiddleware, followUnfollowUser);


export default router;