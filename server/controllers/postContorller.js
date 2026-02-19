
import HttpError from '../models/errorModel.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import { v4 as uuidV4 } from 'uuid';
import cloudinary from '../../utils/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE POST
// POST: /api/posts/create
// PROTECTED
export const createPost = async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body) {
      return next(new HttpError('Post body is required', 422));
    }

    if (!req.files.image) {
      return next(new HttpError('Post image is required', 422));
    } else {
      const { image } = req.files;
      if (image.size > 10000000) {
        return next(new HttpError('Image size should be less than 10MB', 422));
      }

      //rename the image file
      let fileName = image.name;
      fileName = fileName.split('.')
      fileName = fileName[0] + uuidV4() + '.' + fileName[fileName.length - 1];
      await image.mv(path.join(__dirname, '..', 'uploads' + fileName), async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        // save to cloudinary
        const result = await cloudinary.uploader.upload(path.join(__dirname, '..', 'uploads' + fileName), {
          resource_type: 'image',
        });

        if (!result.secure_url) {
          return next(new HttpError('Failed to upload image', 500));
        }

        const newPost = await Post.create({
          creator: req.user.id,
          body,
          image: result.secure_url,
        })
        await User.findByIdAndUpdate(newPost.creator, { $push: { posts: newPost._id } });
        res.status(201).json({ newPost});
      });
    }
    
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}


// GET POST
// GET: /api/posts/:id
// PROTECTED
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('creator').populate({
      path: "comments",
      options: { sort: { createdAt: -1 } }
    });
    res.status(200).json({ post });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}

// GET ALL POSTS
// GET: /api/posts
// PROTECTED
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}

// UPDATE POST
// PATCH: /api/posts/edit/:id
// PROTECTED
export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { body } = req.body;
    const post = await Post.findById(postId);
    // check if creator of the post is logged in
    if(post?.creator != req.user.id) {
      return next(new HttpError('You are not authorized to update this post', 403));
    }
    const updatedPost = await Post.findByIdAndUpdate(postId, { body }, { new: true });
    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}

// DELETE POST
// DELETE: /api/posts/delete/:id
// PROTECTED
export const deletePost = async (req, res, next) => {
  try {
     const postId = req.params.id;
    const post = await Post.findById(postId);
    // check if creator of the post is logged in
    if(post?.creator != req.user.id) {
      return next(new HttpError('You are not authorized to delete this post', 403));
    }
    const deletePost = await Post.findByIdAndDelete(postId);
     await User.findByIdAndUpdate(post?.creator, { $pull: { posts: post._id } });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}

// GET FOLLOWING POSTS
// GET: /api/posts/following
// PROTECTED

export const getFollowingPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const posts = await Post.find({ creator: { $in: user?.following}})
    res.status(200).json({ posts, message: 'Get following posts fetched successfully' });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}


// LIKE/DISLIKE POST
// GET: /api/posts/:id/like-dislike
// PROTECTED
export const likeDislikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    let updatedPost;
    if (post?.likes.includes(req.user.id)) {
      updatedPost = await Post.findByIdAndUpdate(id, { $pull: { likes: req.user.id } }, { new: true });
    } else {
      updatedPost = await Post.findByIdAndUpdate(id, { $push: { likes: req.user.id } }, { new: true });
    }

    res.status(200).json({ updatedPost, message: 'Get post liked/disliked ' });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}

// GET USER POSTS
// GET :/api/users/:id/posts
// PROTECTED
export const getUserPosts = async (req, res, next) => { 
  try {
    const userId = req.params.id;
    const posts = await User.findById(userId).populate({ path: 'posts', options: { sort: { createdAt: - 1 } }}).sort({ createdAt: -1 });
    res.status(200).json({posts, message: 'User posts fetched successfully' });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}

// CREATE BOOKMARK
// POST: /api/posts/:id/bookmark
// PROTECTED
export const createBookmarkPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id)
    const postBookmarked = user?.bookmarks.includes(id);
    if (postBookmarked) {
      const userBookmark = await User.findByIdAndUpdate(req.user.id, { $pull: { bookmarks: id } }, { new: true });
      res.status(200).json(userBookmark);
    } else {
      const userBookmark = await User.findByIdAndUpdate(req.user.id, { $push: { bookmarks: id } }, { new: true });
      res.status(200).json(userBookmark);
    }
    
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}

// GET USER BOOKMARKS
// GET: /api/bookmarks
// PROTECTED
export const getUserBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({ path: 'bookmarks', options: { sort: { createdAt: - 1 } } });
    res.status(200).json( user);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}