import prisma from "../configs/prisma.js"

// export const getAllChats = async (req, res) => {
//     try {
//         const { userId } = await req.auth()
//         const { listingId, chatId } = req.body

//         const listing = await prisma.listing.findUnique({
//             where: { id: listingId }
//         })
//         if (!listing) {
//             return res.status(404).json({ success: false, message: "No listing found" })
//         }

//         let existingChat = null
//         if (chatId) {
//             existingChat = await prisma.chat.findFirst({
//                 where: {
//                     id: chatId,
//                     OR: [
//                         { chatUserId: userId }, { ownerUserId: userId }
//                     ]
//                 },
//                 include: { listing: true, ownerUser: true, chatUser: true, messages: true }
//             })
//         } else {
//             existingChat = await prisma.chat.findFirst({
//                 where: {
//                     listingId,
//                     chatUserId: userId,
//                     ownerUserId: listing.ownerId
//                 },
//                 include: { listing: true, ownerUser: true, chatUser: true, messages: true }
//             })
//         }
//         if (existingChat) {
//             res.status(200).json({ success: true, chat: existingChat })
//             if (existingChat.isLastMessageRead === false) {
//                 const lastMessage = existingChat.messages[existingChat.messages.length - 1]
//                 const isLastMessageSendByMe = lastMessage.sender_id === userId
//                 if (!isLastMessageSendByMe) {
//                     await prisma.chat.update({
//                         where: { id: existingChat.id },
//                         data: {
//                             isLastMessageRead: true
//                         }
//                     })
//                 }
//             }
//             return null
//         }

//         const newChat = await prisma.chat.create({
//             data: {
//                 listingId,
//                 chatUserId: userId,
//                 ownerUserId: listing.ownerId
//             }
//         })

//         const chatWithData = await prisma.chat.findUnique({
//             where: { id: newChat.id },
//             include: {
//                 listing: true,
//                 ownerUser: true,
//                 chatUser: true
//             }
//         })

//         return res.status(200).json({ success: true, chat: chatWithData })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: "No Conversation Found", error })
//     }
// }
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

        // If chatId is provided, fetch that specific chat
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
                // Mark as read if needed
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

        // Use upsert to find or create chat
        const chat = await prisma.chat.upsert({
            where: {
                chatUserId_ownerUserId_listingId: {
                    chatUserId: userId,
                    ownerUserId: listing.ownerId,
                    listingId
                }
            },
            update: {},  // Don't update if exists
            create: {    // Create if doesn't exist
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

        // Mark as read if needed
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
                    { id: userId },
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

export const sendChatMessage = async (req,res) => {
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

        res.status(200).json({ success: true, message: "Message Sent", sendMessage })

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