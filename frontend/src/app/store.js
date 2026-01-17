import { configureStore } from "@reduxjs/toolkit"
import listingReducer from "./features/listingsslice"

export const store = configureStore({
    reducer: {
        listing: listingReducer
    }
})