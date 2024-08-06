const Conversation = require("../models/conversation");
const Message = require("../models/message");
const { getReceiverSocketId, io } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId]}
        })

        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }
        // await conversation.save();
        // await newMessage.save();
        // this will run all in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONS WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        
        if(receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        return res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error sending message", error.message);
        return res.status(500).json({ error: "Interal server error" });
    }
}

const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const senderId = req.user._id;
        
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId]}
        }).populate("messages");

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error sending message", error.message);
        return res.status(500).json({ error: "Interal server error" });
    }
}
module.exports = {
    sendMessage,
    getMessages
}