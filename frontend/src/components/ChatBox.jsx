// import React, { useEffect, useRef, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { clearChat, getSellerChat, setChat } from '../app/features/chatslice'
// import { Loader2Icon, SendIcon, X } from 'lucide-react'
// import { format } from "date-fns"
// import { useAuth, useUser } from "@clerk/clerk-react"
// import api from '../configs/axios'
// import toast from 'react-hot-toast'

// const ChatBox = () => {
//   const { listing, isOpen, chatId } = useSelector((state) => state.chat)
  
//   const { getToken } = useAuth()
//   const {user} = useUser()
//   const dispatch = useDispatch()
//   const [chat, Setchat] = useState(null)
//   const [messages, SetMessages] = useState([])
//   const [newMessage, SetNewMessage] = useState("")
//   const [isLoading, SetisLoading] = useState(true)
//   const [isSending, SetisSending] = useState(false)
//   const messageEndRef = useRef(null)

//   const fetchChat = async () => {
//     const payload = { listingId: listing.id }
//       if (chatId) {
//         payload.chatId = chatId
//       }
//     try {
//       SetisLoading(true)
//       const token = await getToken()
//       const { data } = await api.post("/api/chat/getchats", payload, { headers: { Authorization: `Bearer ${token}` } })
//       console.log(data)
//       setChat(data?.chat || [])
//       SetMessages(data?.chat?.messages || [])
//       SetisLoading(false)
//     } catch (error) {
//       console.log(error)
//       toast.error(error)
//     }

//   }

//   useEffect(() => {
//     if (listing) {
//       fetchChat()
//       const interval = setInterval(() => {
//         fetchChat()
//       }, 3000)
//       return () => {
//         clearInterval(interval)
//       }
//     }
//   }, [listing])

//   useEffect(() => {
//     if (!isOpen) {
//       Setchat(null)
//       SetMessages([])
//       SetisLoading(true)
//       SetNewMessage("")
//       SetisSending(false)
//     }
//   }, [isOpen])

//   async function handleSendMessage(e) {
//     e.preventDefault()
//     if (!newMessage.trim() || isSending) return
//     try {
//       SetisSending(true)
//       const token = await getToken()
//       const { data } = await api.post("/api/chat/send-message", { chatId: chat.id, message: newMessage }, { headers: { Authorization: `Bearer ${token}` } })
//       SetMessages([...messages], data.newMessage)
//       SetNewMessage("")
//       SetisSending(false)

//     } catch (error) {
//       console.log(error)
//       toast.error(error)
//     }
//   }

//   // For scrolling
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages.length])

//   if (!listing || !isOpen) return null

//   return (
//     <div className='fixed inset-0 bg-black/70 backdrop:blur bg-opacity-50 z-100 flex items-center justify-center sm:p-4'>
//       <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-2xl h-screen sm:h-[600px] flex flex-col'>
//         {/* Header */}
//         <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
//           <div className='flex-1 min-w-0'>
//             <h3 className='font-semibold text-lg truncate'>{listing?.title}</h3>
//             <p className='text-sm text-indigo-100 truncate'>{user.id === listing?.ownerId ? `Chatting with buyer (${chat?.chatUser?.name || "Loading..."})` : `Chatting with seller (${chat?.ownerUser?.name || "Loading..."})`}</p>
//           </div>
//           <button onClick={() => dispatch(clearChat())} className='ml-4 p-1 hover:bg-white/20 hover:bg-opacity-20 rounded-lg transition-colors'>
//             <X className='w-5 h-5' />
//           </button>
//         </div>
//         {/* Messages */}
//         <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100'>
//           {isLoading ? (
//             <div className='flex items-center justify-center h-full'>
//               <Loader2Icon className='size-6 animate-spin text-indigo-600' />
//             </div>
//           ) : messages.length === 0 ? (
//             <div className='flex items-center justify-center h-full'>
//               <div className='text-center'>
//                 <p className='text-gray-500 mb-2'>No Messages Yet</p>
//                 <p className='text-sm text-gray-400'>Start the conversation!</p>
//               </div>
//             </div>
//           ) : (
//             messages.map((message) => (
//               <div key={message.id} className={`flex ${message.sender_id === user.id ? "justify-end" : "justify-start"}`}>
//                 <div className={`max-w-[70%] rounded-lg p-3 pb-1 ${message.sender_id === user.id ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-800"} `}>
//                   <p className='mt-3 mb-3 text-sm break-words whitespace-pre-wrap'>{message.message}</p>
//                   <p className={`text-[10px] mt-1 ${message.sender_id === user.id ? "text-indigo-200" : "text-gray-400"}`}>{format(new Date(message.createdAt), "MMM dd 'at' h:mm a")}</p>
//                 </div>
//               </div>
//             ))
//           )}
//           <div ref={messageEndRef} />
//         </div>
//         {chat?.listing?.status === "active" ? (
//           <form onSubmit={handleSendMessage} className='p-4 bg-white border-t border-gray-200 rounded-b-lg'>
//             <div className='flex items-end space-x-2'>
//               <textarea value={newMessage} onChange={(e) => SetNewMessage(e.target.value)} onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault()
//                   handleSendMessage(e)
//                 }
//               }} placeholder='Type your message...' className='flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus-outline-indigo-500 max-h-32' rows={1} />
//               <button disabled={!newMessage.trim() || isSending} type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg disabled:opacity-50 transition-colors'>
//                 {isLoading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : <SendIcon className='w-5 h-5' />}
//               </button>
//             </div>
//           </form>
//         ) : (
//           <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
//             <p className='text-sm text-gray-600 text-center'>{chat ? `Listing is ${chat?.listing.status}` : "Loading Chat..."}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ChatBox

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearChat } from '../app/features/chatslice'
import { Loader2Icon, SendIcon, X } from 'lucide-react'
import { format } from "date-fns"
import { useAuth, useUser } from "@clerk/clerk-react"
import api from '../configs/axios'
import toast from 'react-hot-toast'

const ChatBox = () => {
  const { listing, isOpen, chatId } = useSelector((state) => state.chat)
  
  const { getToken } = useAuth()
  const { user } = useUser()
  const dispatch = useDispatch()
  const [chat, Setchat] = useState(null)
  const [messages, SetMessages] = useState([])
  const [newMessage, SetNewMessage] = useState("")
  const [isLoading, SetisLoading] = useState(true)
  const [isSending, SetisSending] = useState(false)
  const messageEndRef = useRef(null)

  const fetchChat = async () => {
    try {
      SetisLoading(true)
      const token = await getToken()
      
      // Build payload conditionally
      const payload = { listingId: listing.id }
      if (chatId) {
        payload.chatId = chatId
      }
      
      const { data } = await api.post("/api/chat/getchats", payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      
      console.log('Chat data:', data)
      Setchat(data?.chat || null)
      SetMessages(data?.chat?.messages || [])
      SetisLoading(false)
    } catch (error) {
      console.log('Fetch chat error:', error)
      toast.error(error.response?.data?.message || "Failed to load chat")
      SetisLoading(false)
    }
  }

  useEffect(() => {
    if (listing) {
      fetchChat()
      const interval = setInterval(() => {
        fetchChat()
      }, 3000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [listing])

  useEffect(() => {
    if (!isOpen) {
      Setchat(null)
      SetMessages([])
      SetisLoading(true)
      SetNewMessage("")
      SetisSending(false)
    }
  }, [isOpen])

async function handleSendMessage(e) {
  e.preventDefault()
  if (!newMessage.trim() || isSending || !chat) return
  
  try {
    SetisSending(true)
    const token = await getToken()
    const { data } = await api.post("/api/chat/send-message", 
      { chatId: chat.id, message: newMessage }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    console.log('Backend response:', data) // Add this to debug
    
    // Make sure data.newMessage exists and has the right structure
    if (data.newMessage && data.newMessage.sender_id) {
      SetMessages([...messages, data.newMessage])
    } else {
      console.error('Invalid message structure:', data)
    }
    
    SetNewMessage("")
    SetisSending(false)
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.message || "Failed to send message")
    SetisSending(false)
  }
}

  // For scrolling
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  if (!listing || !isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/70 backdrop:blur bg-opacity-50 z-100 flex items-center justify-center sm:p-4'>
      <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-2xl h-screen sm:h-[600px] flex flex-col'>
        {/* Header */}
        <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-lg truncate'>{listing?.title}</h3>
            <p className='text-sm text-indigo-100 truncate'>
              {user?.id === listing?.ownerId 
                ? `Chatting with buyer (${chat?.chatUser?.name || "Loading..."})` 
                : `Chatting with seller (${chat?.ownerUser?.name || "Loading..."})`}
            </p>
          </div>
          <button 
            onClick={() => dispatch(clearChat())} 
            className='ml-4 p-1 hover:bg-white/20 hover:bg-opacity-20 rounded-lg transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <Loader2Icon className='size-6 animate-spin text-indigo-600' />
            </div>
          ) : messages.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <p className='text-gray-500 mb-2'>No Messages Yet</p>
                <p className='text-sm text-gray-400'>Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 pb-1 ${
                    message.sender_id === user?.id 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <p className='mt-3 mb-3 text-sm break-words whitespace-pre-wrap'>
                    {message.message}
                  </p>
                  <p 
                    className={`text-[10px] mt-1 ${
                      message.sender_id === user?.id 
                        ? "text-indigo-200" 
                        : "text-gray-400"
                    }`}
                  >
                    {format(new Date(message.createdAt), "MMM dd 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Input Area */}
        {chat?.listing?.status === "active" ? (
          <form onSubmit={handleSendMessage} className='p-4 bg-white border-t border-gray-200 rounded-b-lg'>
            <div className='flex items-end space-x-2'>
              <textarea 
                value={newMessage} 
                onChange={(e) => SetNewMessage(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }} 
                placeholder='Type your message...' 
                className='flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-indigo-500 max-h-32' 
                rows={1} 
              />
              <button 
                disabled={!newMessage.trim() || isSending || !chat?.id} 
                type='submit' 
                className='bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg disabled:opacity-50 transition-colors'
              >
                {isSending ? (
                  <Loader2Icon className='w-5 h-5 animate-spin' />
                ) : (
                  <SendIcon className='w-5 h-5' />
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <p className='text-sm text-gray-600 text-center'>
              {chat ? `Listing is ${chat?.listing.status}` : "Loading Chat..."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatBox