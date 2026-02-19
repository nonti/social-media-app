import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

import HttpError from '../models/errorModel.js';

// CREATE COMMENT
// POST: /api/comments/:postId

export const createComment = async (req, res, next) => { 
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    if (!comment) {
      return next(new HttpError("Comment is required", 422));
    }

    const commentCreator = await User.findById(req.user.id); 
    
    // get comment creator 
    const newComment = await Comment.create({
      creator: {
        creatorId:  req.user.id ,
        creatorName: commentCreator.fullname,
        creatorAvatar: commentCreator.profileAvatar,
      }, comment, postId })
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment?._id } }, {new: true});
  
    res.json(newComment);
  } catch (error) {
    return next(new HttpError(error.message || "Creating comment failed", 500));
  }
}

// GET POST COMMENT
// GET: /api/comments/:postId
export const getPostComment = async (req, res, next) => { 
  try {
    const { postId } = req.params;
    const comments = await Post.findById(postId).populate({ path: 'comments', options: { sort: { createdAt: -1 }} })
    res.json(comments);
  } catch (error) {
    return next(new HttpError);
  }
}

// DELETE COMMENT
// DELETE: /api/comments/:commentId
export const deleteComment = async (req, res, next) => { 
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    const commentCreator = await User.findById(comment?.creator?.creatorId)
    if (commentCreator?._id != req.user.id) {
      return next(new HttpError('Unauthorized actions.', 403))
    }

    await Post.findByIdAndUpdate(comment?.postId, { $pull: { comments: commentId } });
    const deletedComment = await Comment.findByIdAndDelete(commentId)
    res.json(deletedComment);
  } catch (error) {
    return next(new HttpError);
  }
}