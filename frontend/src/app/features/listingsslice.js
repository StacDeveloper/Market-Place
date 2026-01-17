import { createSlice } from "@reduxjs/toolkit"
import { dummyListings } from "../../assets/assets"

const listingSlice = createSlice({
    name: "listings",
    initialState: {
        listings: dummyListings,
        userListings: dummyListings,
        balance: {
            earned: 0,
            withdrawn: 0,
            available: 0
        },
    },
    reducers: {
        setListings: ({ state, action }) => {
            state.listings = action.payload
        }
    }
})

export const { setListings, setUserListings } = listingSlice.actions
export default listingSlice.reducer