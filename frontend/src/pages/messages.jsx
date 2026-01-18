import React, { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Search } from "lucide-react"
import { dummyChats } from "../assets/assets"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { useDispatch } from "react-redux"
import { setChat } from '../app/features/chatslice'

const MessagesPage = () => {
  const dispatch = useDispatch()
  const user = { id: "user_1" }

  const [chats, Setchats] = useState([])
  const [searchQuery, SetsearchQuery] = useState("")
  const [loading, Setloading] = useState(true)

  async function fetchUserChats() {
    Setchats(dummyChats)
    Setloading(false)
  }

  const filteredChats = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const chatUser = chat.UserId === user?.id ? chat?.ownerUser : chat?.chatUser
      return chat.listing.title.toLowerCase().includes(query) || chatUser?.name?.toLowerCase().includes(query)
    })
  }, [chats, searchQuery])

  const handleOpen = (chat) => {
    dispatch(setChat({ listing: chat.listing, chatId: chat.id }))
  }

  const formatTime = (dateString) => {
    if (!dateString) return
    const date = parseISO(dateString)
    if (isToday(date)) {
      return 'Today' + format(date, "HH:mm")
    }
    if (isYesterday(date)) {
      return 'Yesterday' + format(date, "HH:mm")
    }
    return format(date, "MMM d")
  }

  useEffect(() => {
    fetchUserChats()
    const interval = setInterval(() => {
      fetchUserChats()
    }, 10 * 100)
    return () => clearInterval(interval)
  }, [])

  return (
    // This are the new changes
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='py-10'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2' >Messages</h1>
          <p className='text-gray-600'>Chat with buyers and sellers</p>
        </div>

        {/* Search Bar */}
        <div className='relative max-w-xl mb-8'>
          <Search className='absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input type="text" placeholder='Search conversation...' value={searchQuery} onChange={(e) => SetsearchQuery(e.target.value)} className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-indigo-500' />
        </div>

        {/* Chat List */}
        {loading ? (
          <div className='text-center text-gray-500 py-20'>
            Loading Messages...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className='bg-white rounded-lg shadow-xs border border-gray-200 p-16 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <MessageCircle className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-xl font-medium text-gray-800 mb-2'>{searchQuery ? "No Chats Found" : "No messages Yet"}</h3>
            <p>
              {searchQuery ? "Try a different search term" : 'Start a conversation by viewwing a listing and clicking "Chat with Seller" '}
            </p>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-xs border border-gray-200 divide-y divide-gray-200'>
            {
              filteredChats.map((chat) => {
                const chatUser = chat.chatUserId === user?.id ? chat.ownerUser : chat.chatUser
                return (
                  <button onClick={() => handleOpen(chat)} key={chat.id} className='w-full p-4 hover:bg-gray-50 transition-colors text-left'>
                    <div className='flex items-start space-x-4'>
                      <div className='flex-shrink-0'>
                        <img src={chatUser?.image} alt={chat?.chatUser?.name} className='w-12 h-12 rounded-lg object-cover' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <h3 className='font-semibold text-gray-800 truncate'>{chat.listing?.title}</h3>
                          <span className='text-xs text-gray-500 flex-shrink-0 ml-2'>{formatTime(chat.updatedAt)}</span>
                        </div>
                        <p className='text-sm text-gray-600 truncate mb-1'>{chatUser?.name}</p>
                        <p className={`text-sm truncate ${!chat.isLastMessageRead && chat.lastMessageSenderId !== user?.id ? "text-indigo-600 font-medium" : "text-gray-500"}`}>{chat.lastMessage || "No Messages yet"}</p>
                      </div>
                    </div>
                  </button>
                )
              })
            }
          </div>
        )
        }
      </div>
    </div>
  )
}

export default MessagesPage