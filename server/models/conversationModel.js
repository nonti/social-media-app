import mongoose, { Schema } from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: {
    text: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'user'}
  }
}, {timestamps: true})


const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation