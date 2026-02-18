import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
})

const Post = mongoose.model('Post', postSchema);

export default Post;