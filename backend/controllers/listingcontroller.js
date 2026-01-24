import imageKit from "../configs/imagekit"
import prisma from "../configs/prisma"
import fs from "fs"


export const addListing = async (req, res) => {
    try {
        const { userId } = await req.auth()
        if (req.plan !== "premium") {
            const listingCount = await prisma.listing.count({
                where: { ownerId: userId }
            })
            if (listingCount >= 5) {
                return res.status(400).json({ success: false, message: "You have exceeded limit please upgrade to free plan for more listing" })
            }
        }
        const accountDetails = JSON.parse(req.body.accountDetails)

        accountDetails.followers_count = parsefloat(accountDetails.followers_count)
        accountDetails.engagement_rate = parsefloat(accountDetails.engagement_rate)
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views)
        accountDetails.price = parseFloat(accountDetails.price)
        accountDetails.platform = accountDetails.platform.toLowerCase()
        accountDetails.niche = accountDetails.niche.toLowerCase()
        accountDetails.username.startsWith("@") ? accountDetails.username = accountDetails.username.slice(1) : null

        const uploadImages = req.files.map(async (file) => {
            const response = await imageKit.files.upload({
                file: fs.createReadStream(file.path),
                filename: `${Date.now()}.png`,
                folder: "marketplace",
                transformation: {
                    pre: "w-1280 h-auto"
                }
            })
            return response.url
        })

        const images = await Promise.all(uploadImages)

        const listing = await prisma.listing.create({
            data: {
                ownerId: userId,
                images,
                ...accountDetails,
            }
        })
        return res.status(201).json({ success: true, message: "Account Listed Successfully", listing })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to add listing", error })
    }
}

export const getAllListing = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { status: "active" },
            include: { owner: true },
            orderBy: { createdAt: "desc" }
        })

        if (!listings || listings.length === 0) {
            return res.json({ success: false, message: "No listings found", listings: [] })
        }
        return res.json({ success: true, listings })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to get all listing", error })
    }
}

export const getAllUserListings = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const listings = await prisma.listing.findMany({
            where: {
                ownerId: userId,
                status: { not: "deleted" },

            },
            orderBy: { createdAt: "desc" }

        })

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        const balance = {
            earned: user.earned,
            withdrawn: user.withdrawn,
            available: user.earned - user.withdrawn
        }

        if (!listings || listings.length === 0) {
            return res.json({ success: false, message: `No listing found for the user ${user.name}`, listings, balance })
        }

        return res.status(200).json({ success: true, listings, balance })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to particular user listing", error })
    }
}

export const updateListings = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const accountDetails = JSON.parse(req.body.accountDetails)

        if (req.files.length + accountDetails.images.length > 5) {
            return res.stauts(400).json({ success: false, message: "You can only upload images upto 5" })
        }
        accountDetails.followers_count = parsefloat(accountDetails.followers_count)
        accountDetails.engagement_rate = parsefloat(accountDetails.engagement_rate)
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views)
        accountDetails.price = parseFloat(accountDetails.price)
        accountDetails.platform = accountDetails.platform.toLowerCase()
        accountDetails.niche = accountDetails.niche.toLowerCase()
        accountDetails.username.startsWith("@") ? accountDetails.username = accountDetails.username.slice(1) : null

        const listings = await prisma.listing.update({
            where: { id: accountDetails.id, ownerId: userId },
            data: accountDetails

        })

        if (!listings) {
            return res.status(400).json({ success: false, message: "Listing not found" })
        }

        if (listings.status === "sold") {
            return res.status(400).json({ success: false, message: "This listing has been already sold" })
        }
        if (req.files.length > 0) {
            const uploadImages = req.files.map(async (file) => {
                const response = await imageKit.files.upload({
                    file: fs.createReadStream(file.path),
                    filename: `${Date.now()}.png`,
                    folder: "marketplace",
                    transformation: {
                        pre: "w-1280 h-auto"
                    }
                })
                return response.url
            })

            const images = await Promise.all(uploadImages)
            const listing = await prisma.listing.update({
                where: { id: accountDetails.id, ownerId: userId },
                data: {
                    ownerId: userId,
                    ...accountDetails,
                    images: [...accountDetails.images, ...images]
                }
            })
            return res.status(200).json({ success: true, message: "Account Updated Successfully", listing })
        }
        return res.status(200).json({ success: true, message: "Account Updated Successfully", listings })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to particular user listing", error })
    }
}

export const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = await req.auth()

        const listing = await prisma.listing.findUnique({
            where: { id: id, ownerId: userId }
        })

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" })
        }
        if (!listing.status === "active" || listing.status === "inactive") {
            await prisma.listing.update({
                where: { id: id, ownerId: userId },
                data: {
                    status: listing.status === "active" ? "inactive" : "active"
                }
            })
        } else if (listing.status === "ban") {
            return res.status(400).json({ success: false, message: "Your listing is banned" })
        } else if (listing.status === "sold") {
            return res.status(400).json({ success: false, message: "Your listing is sold" })
        }
        return res.status(200).json({ success: true, message: "Listing Status has been updated successfully", listing })



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to particular user listing", error })
    }
}

export const deleteUserListing = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { listingId } = req.params

        const listing = await prisma.listing.findFirst({
            where: { id: listingId, ownerId: userId },
            include: { owner: true }
        })

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" })
        }

        if (listing.status === "sold") {
            return res.status(404).json({ success: false, message: "Sold listing can't be deleted" })
        }

        if (listing.isCredentialChanged) {

        }
        const updateListing = await prisma.listing.update({
            where: { id: listingId },
            data: {
                status: "deleted"
            }
        })
        return res.status(200).json({ success: true, message: "Listing Deleted Successfully", updateListing })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to particular user listing", error })
    }
}

export const addcredentials = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { listingId, credential } = req.body

        if (!credential || credential.length === 0 || !listingId) {
            return res.status(400).json({ success: false, message: "Please provide all the required details" })
        }
        const listing = await prisma.listing.findFirst({
            where: { id: listingId, ownerId: userId }
        })

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found or you are not the owner" })
        }

        const updatedCredentials = await prisma.credential.create({
            data: {
                listingId: listingId,
                originalCredential: credential
            }
        })

        const updateListing = await prisma.listing.update({
            where: { id: listingId },
            data: {
                isCredentialSubmitted: true
            }
        })

        return res.status(200).json({ success: true, message: "Credentials added successfully", updateListing, updatedCredentials })


    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to particular user listing", error })
    }
}

export const markedFeatured = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = await req.auth()

        if (req.plan !== "premium") {
            return res.status(400).json({ success: false, message: "You are on Free plan please upgrade to Premium plan to mark this as featured" })
        }
        const updateAllListings = await prisma.listing.updateMany({
            where: { ownerId: userId },
            data: {
                featured: false
            }
        })

        const markListingtoFeature = await prisma.listing.update({
            where: { id: id },
            data: { featured: true }
        })

        return res.status(200).json({ success: true, message: "Marked as featured successfully", updateAllListings, markListingtoFeature })


    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to mark featured listing", error })
    }
}

export const getAllUserOrders = async (req, res) => {
    try {
        const { userId } = await req.auth()
        let orders = await prisma.transaction.findMany({
            where: { userId: userId, isPaid: true },
            include: { listing: true }
        })

        if (!orders || orders.length === 0) {
            return res.status(400).json({ success: false, message: "No order found" })
        }

        const credentials = await prisma.credential.findMany({
            where: {
                listingId: {
                    in: orders.map((ord) => ord.listingId)
                }
            }
        })

        const ordersWithCredentials = orders.map((ord) => {
            const credential = credentials.find((cred) => cred.listingId === ord.listingId)
            return { ...ord, credential }
        })

        return res.status(200).json({ success: true, ordersWithCredentials })




    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to get all user orders", error })
    }
}

export const withDrawAmount = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { amount, account } = req.body
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        const balance = user.earned - user.withdrawn

        if (amount > balance) {
            return res.status(400).json({ success: false, message: "You dont have enough balance" })
        }
        const withdrawal = await prisma.withdrawal.create({
            data: {
                userId,
                amount,
                account
            }
        })

        const updateAmt = await prisma.user.update({
            where: { id: userId },
            data: {
                withdrawn: { increment: amount }
            }
        })

        return res.status(200).json({ success: true, updateAmt, withdrawal, message: "Successfully applied for withdrawal" })



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "failed to get withdraw amount", error })
    }
}

export const purchaseAccount = async(req,res)=>{

}