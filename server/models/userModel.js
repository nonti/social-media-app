import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileAvatar: { type: String, default: 'https://res.cloudinary.com/dvjjk29fd/image/upload/v1769760498/user-default_rdmsip.jpg' },
  bio: { type: String, default: 'No bio yet' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

export default User;