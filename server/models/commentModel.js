import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  creator: {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creatorName: { type: String, required: true },
    creatorAvatar: { type: String },
  },
  
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})




const Comment = mongoose.model('Comment', commentSchema)

export default Comment