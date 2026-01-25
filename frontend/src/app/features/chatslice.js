import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../configs/axios"

export const getSellerChat = createAsyncThunk("/chat/sellerchat", async ({ getToken, listing, chatId }) => {
    try {
        const token = await getToken()
        const { data } = await api.post("/api/chat/getchats", { listing, chatId }, { headers: { Authorization: `Bearer ${token}` } })
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
    }

})


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
        clearChat: (state) => {
            state.listing = null
            state.isOpen = false
            state.chatId = null
        }
    }, extraReducers: (builder) => {
        builder.addCase(getSellerChat.fulfilled, (state, action) => {
            if (action.payload.chatId) {
                state.chatId = action.payload?.chatId
            }
            if (action.payload.listing) {
                state.listing = action.payload?.listing
            }
        })
    }
})

export const { setChat, clearChat } = chateSlice.actions
export default chateSlice.reducer