import express from "express"
import { addcredentials, addListing, deleteUserListing, getAllListing, getAllUserListings, getAllUserOrders, markedFeatured, purchaseAccount, toggleStatus, updateListings, withDrawAmount } from "../controllers/listingcontroller.js"
import { protectRoute } from "../middleware/auth.js"
import upload from "../configs/multer.js"

const listingRouter = express.Router()

listingRouter.post("/create-listing", protectRoute, upload.array("images", 5), addListing)
listingRouter.put("/update-listing", protectRoute, upload.array("images", 5), updateListings)
listingRouter.get("/public", protectRoute, getAllListing)
listingRouter.get("/user", protectRoute, getAllUserListings)
listingRouter.put("/:id/status", protectRoute, toggleStatus)
listingRouter.delete("/listingid", protectRoute, deleteUserListing)
listingRouter.post("/add-credentials", protectRoute, addcredentials)
listingRouter.put("/featured/:id", protectRoute, markedFeatured)
listingRouter.get("/user-orders", protectRoute, getAllUserOrders)
listingRouter.post("/withdraw", protectRoute, withDrawAmount)
listingRouter.post("/purchase-account/:listingid", protectRoute, purchaseAccount)


export default listingRouter