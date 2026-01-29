import prisma from "../configs/prisma.js"

const clients = new Map()

export const broadCastMessage = async (chatId, message) => {
    let brodcastCount = 0
    clients.forEach((c, key) => {
        if (key.startsWith(`${chatId}-`)) {
            try {
                console.log(c)
                const m = c.write(`data :${JSON.stringify({ type: "message", message })}\n\n`)
                console.log(m)
                brodcastCount++
            } catch (error) {
                console.log(error)
                clients.delete(key)
            }
        }
    })
}

export const getAllChats = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { listingId, chatId } = req.body

        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        })
        if (!listing) {
            return res.status(404).json({ success: false, message: "No listing found" })
        }


        if (chatId) {
            const existingChat = await prisma.chat.findFirst({
                where: {
                    id: chatId,
                    OR: [
                        { chatUserId: userId },
                        { ownerUserId: userId }
                    ]
                },
                include: { listing: true, ownerUser: true, chatUser: true, messages: true }
            })

            if (existingChat) {

                if (existingChat.isLastMessageRead === false && existingChat.messages?.length > 0) {
                    const lastMessage = existingChat.messages[existingChat.messages.length - 1]
                    const isLastMessageSendByMe = lastMessage.sender_id === userId
                    if (!isLastMessageSendByMe) {
                        await prisma.chat.update({
                            where: { id: existingChat.id },
                            data: { isLastMessageRead: true }
                        })
                    }
                }
                return res.status(200).json({ success: true, chat: existingChat })
            }
        }


        const chat = await prisma.chat.upsert({
            where: {
                chatUserId_ownerUserId_listingId: {
                    chatUserId: userId,
                    ownerUserId: listing.ownerId,
                    listingId
                }
            },
            update: {},
            create: {
                listingId,
                chatUserId: userId,
                ownerUserId: listing.ownerId
            },
            include: {
                listing: true,
                ownerUser: true,
                chatUser: true,
                messages: true
            }
        })


        if (chat.isLastMessageRead === false && chat.messages?.length > 0) {
            const lastMessage = chat.messages[chat.messages.length - 1]
            const isLastMessageSendByMe = lastMessage.sender_id === userId
            if (!isLastMessageSendByMe) {
                await prisma.chat.update({
                    where: { id: chat.id },
                    data: { isLastMessageRead: true }
                })
            }
        }
        broadCastMessage(chatId, chat)
        return res.status(200).json({ success: true, chat })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error handling conversation", error: error.message })
    }
}

export const getAllUserChats = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const chats = await prisma.chat.findMany({
            where: {
                OR: [
                    { chatUserId: userId },
                    { ownerUserId: userId }
                ]
            },
            include: {
                listing: true,
                chatUser: true,
                ownerUser: true
            },
            orderBy: {
                updatedAt: "desc"
            }
        })

        if (!chats || chats.length === 0) {
            return res.status(200).json({ success: true, message: "No chats found", chats: [] })
        }

        return res.status(200).json({ success: true, chats })


    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `No Conversation Found for ${userId} `, error })
    }
}



export const sendChatMessage = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { chatId, message } = req.body

        const chat = await prisma.chat.findFirst({
            where: {
                AND: { id: chatId },
                OR: [
                    { chatUserId: userId },
                    { ownerUserId: userId }
                ],
            },
            include: {
                listing: true,
                ownerUser: true,
                chatUser: true
            }
        }
        )

        if (!chat) {
            return res.status(404).json({ success: false, message: "No chats found" })
        } else if (chat.listing.status !== "active") {
            return res.status(400).json({ success: false, message: `Listing is ${chat.listing.status}` })
        }

        const createNewMessage = {
            message,
            sender_id: userId,
            chatId,
            createdAt: new Date
        }
        const sendMessage = await prisma.message.create({
            data: createNewMessage
        })

        const newMessage = createNewMessage
        broadCastMessage(chatId, createNewMessage)
        res.status(200).json({ success: true, message: "Message Sent", newMessage })

        await prisma.chat.update({
            where: { id: chatId },
            data: {
                lastMessage: createNewMessage.message,
                isLastMessageRead: false,
                lastMessageSenderId: userId
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send message", error })
    }
}


export const SSEchat = async (req, res) => {
    try {
        const { chatId } = req.params
        const { userId } = await req.auth()

        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                OR: [
                    { ownerUser: userId },
                    { chatUserId: userId }
                ]
            }
        })

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" })
        }

        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")
        res.setHeader("Access-Control-Allow-Origin", "*")

        res.write(`data:${JSON.stringify({ type: "connected", chatId })}\n\n`)

        const clientKey = `${chatId}-${userId}`
        clients.set(clientKey, res)

        const pingInterval = setInterval(() => {
            res.write(`data:${JSON.stringify({ type: "ping" })}\n\n`)
        }, 30000);

        req.on("close", () => {
            clearInterval(pingInterval)
            clients.delete(clientKey)
        })

    } catch (error) {
        console.log(error)
    }
}