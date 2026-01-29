import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { getAllChats, getAllUserChats, sendChatMessage, SSEchat } from "../controllers/chatcontroller.js"

const chatRouter = express.Router()

chatRouter.post("/getchats", protectRoute, getAllChats)
chatRouter.get("/user-chats", protectRoute, getAllUserChats)
chatRouter.post("/send-message", protectRoute, sendChatMessage)
chatRouter.get("/stream/:chatId", protectRoute, SSEchat)


export default chatRouter