import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { getAllChats, getAllUserChats, sendChatMessage } from "../controllers/chatcontroller.js"

const chatRouter = express.Router()

chatRouter.post("/getchats", protectRoute, getAllChats)
chatRouter.get("/user-chats", protectRoute, getAllUserChats)
chatRouter.post("/send-message", protectRoute, sendChatMessage)


export default chatRouter