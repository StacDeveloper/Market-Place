import express from "express"
import { protectAdmin } from "../middleware/auth.js"
import { changeCredential, changeStatus, getAllListing, getAllTransaction, getAllUnchangedListings, getAllUnverifiedListings, getAllWithDrawRequests, getCredential, getDashboard, isAdmin, markCredentialVerified, markWithDrawalsPaid } from "../controllers/admincontroller.js"

const adminRouter = express.Router()

adminRouter.get("/isAdmin", protectAdmin, isAdmin)
adminRouter.get("/dashboard", protectAdmin, getDashboard)
adminRouter.get("/all-listings", protectAdmin, getAllListing)
adminRouter.put("/change-status/:listingId", protectAdmin, changeStatus)
adminRouter.get("/unverified-listings", protectAdmin, getAllUnverifiedListings)
adminRouter.get("/credential/:listingId", protectAdmin, getCredential)
adminRouter.put("/verfify-credential/:listingId", protectAdmin, markCredentialVerified)
adminRouter.get("/unchanged-listings", protectAdmin, getAllUnchangedListings)
adminRouter.put("/change-credential/:listingId", protectAdmin, changeCredential)
adminRouter.get("/transactions", protectAdmin, getAllTransaction)
adminRouter.get("/withdraw-requests", protectAdmin, getAllWithDrawRequests)
adminRouter.put("/withdraw-mark/:id", protectAdmin, markWithDrawalsPaid)




export default adminRouter