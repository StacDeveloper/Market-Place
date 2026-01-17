import { createSlice } from "@reduxjs/toolkit"

const chateSlice = createSlice({
    name: "chat",
    initialState: {
        listing: null,
        isOpen: false,
        chatId: null
    },
    reducers: {
        setChat: (state, action) => {
            state.listing = action.payload.listing
            state.isOpen = true
            if (action.payload.chatId) {
                state.chatId = action.payload.chatId
            }
        },
        createChat: (state) => {
            state.listing = null
            state.isOpen = false
            state.chatId = null
        }
    }
})

export const { setChat, createChat } = chateSlice.actions
export default chateSlice.reducer