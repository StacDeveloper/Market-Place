
import { configureStore } from "@reduxjs/toolkit"
import listingReducer from "./features/listingsslice"
import chatReducer from "./features/chatslice"

export const store = configureStore({
    reducer: {
        listing: listingReducer,
        chat: chatReducer
    }


})