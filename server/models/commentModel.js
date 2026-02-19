import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  creator: {
    type: {
      creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      creatorName: { type: String, required: true },
      creatorAvatar: { type: String, required: true }}},
  
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true})




const Comment = mongoose.model('Comment', commentSchema)

export default Comment