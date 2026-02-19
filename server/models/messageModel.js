import mongoose, { Schema } from "mongoose";


const mesageSchema = new mongoose.Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }
  
}, { timestamps: true })

const Message = mongoose.model('Message', mesageSchema)


export default Message;