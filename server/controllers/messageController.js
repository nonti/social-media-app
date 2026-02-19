import HttpError from "../models/errorModel.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


// CREATE MESSAGEes/:receiverId
// POST: api/message
// PROTECTED
export const createMessage = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const { messageBody } = req.body;

    // check if 
    let conversation = await Conversation.findOne({ participants: { $all: [req.user.id, receiverId] } })
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
        lastMessage: { text: messageBody, senderId: req.user.id }
      })
    }
    
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId: req.user.id,
      text: messageBody
    })
    await conversation.updateOne({
      lastMessage: {
        text: messageBody,
        senderId: req.user.id,

      }
    })
    
    const receiverScoketId = getReceiverSocketId(receiverId);
    if (receiverScoketId) {
      io.to(receiverScoketId).emit('newMessage', newMessage)
    }
    res.json(newMessage)
  } catch (error) {
    return next(new HttpError(error))
  }
}



//0GET MESSAGEes/:receiverId
// GET: api/messages/:receiverId
// PROTECTED
export const getMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const conversation = await Conversation.findOne({ participants: { $all: [req.user.id, receiverId] } })
    if (!conversation) {
      return next(new HttpError('You have no conversation with this person', ))
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    return next(new HttpError(error))
  }
}


// GET CONVERSATIONS:reciverId
// POST: api/conversations
// PROTECTED
export const getConversations = async (req, res, next) => {
  try {
    let conversations = await Conversation.find({ participants: req.user.id }).populate({
      path: 'participants', select: 'fullname profileAvatar'
    }).sort({ createdAt: -1 });

    // remove logged in user from the participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== req.user.id.toString()
      );
    });
    res.json(conversations)
  } catch (error) {
    return next(new HttpError(error))
  }
}