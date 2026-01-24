import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../configs/axios"


export const getAllPublicListing = createAsyncThunk("listing/getAllPublicListing", async (getToken) => {
    try {
        const token = await getToken()
        const { data } = await api.get("/api/listing/public", { headers: { Authorization: `Bearer ${token}` } })

        return data

    } catch (error) {
        console.log(error)
        return []
    }
})

export const getAllUserListing = createAsyncThunk("listing/getAllUserListing", async (getToken) => {
    try {
        const token = await getToken()
        const { data } = await api.get("/api/listing/user", { headers: { Authorization: `Bearer ${token}` } })
        return data


    } catch (error) {
        console.log(error)
        return []
    }
})

const listingSlice = createSlice({
    name: "listings",
    initialState: {
        listings: [],
        userListings: [],
        balance: {
            earned: 0,
            withdrawn: 0,
            available: 0
        },
    },
    reducers: {
        setListings: ({ state, action }) => {
            state.listings = action.payload.listings
        },
        setUserListings: ({ state, action }) => {
            state.userListings = action.payload.userListings
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllPublicListing.fulfilled, (state, action) => {
            state.listings = action.payload.listings
        })
        builder.addCase(getAllUserListing.fulfilled, (state, action) => {
            state.userListings = action.payload.listings
            state.balance = action.payload.balance
        })
    }
})

export const { setListings, setUserListings } = listingSlice.actions
export default listingSlice.reducer