import prisma from "../configs/prisma.js"

export const isAdmin = async (req, res) => {
    try {
        return res.json({ success: true, isAdmin: true })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const getDashboard = async (req, res) => {
    try {
        const totalListings = await prisma.listing.count({})
        const transactions = await prisma.transaction.findMany({
            where: { isPaid: true },
            select: { amount: true }
        })

        const totalRevenue = transactions.reduce((total, transaction) => total + transaction.amount, 0)

        const activeListing = await prisma.listing.count({
            where: { status: "active" }
        })
        const totalUser = await prisma.user.count({})
        const recentListings = await prisma.listing.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5,
            include: { owner: true }
        })
        return res.json({ success: true, dashboardData: { totalListings, totalRevenue, activeListing, totalUser, recentListings } })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const getAllListing = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            include: { owner: true },
            orderBy: { createdAt: "desc" }
        })

        if (!listings || listings.length === 0) {
            return res.json({ success: true, listings: [] })
        }
        return res.json({ success: true, listings })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}
export const changeStatus = async (req, res) => {
    try {
        const { listingId } = req.params
        const { status } = req.body

        if (typeof status === Object ? JSON.stringify(status) : status) {
            const listing = await prisma.listing.findUnique({
                where: { id: listingId }
            })
            if (!listing) {
                return res.json({ success: false, message: "Listing not found" })
            }
            const updatedStatus = await prisma.listing.update({
                where: { id: listingId },
                data: {
                    status
                }
            })
            return res.status({ success: true, message: "Listing Status Updated", updatedStatus })
        }


    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const getAllUnverifiedListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                isCredentialSubmitted: true,
                isCredentialVerified: false,
                status:
                    { not: "deleted" }
            },
            orderBy: { createdAt: "desc" }
        })

        if (!listings || listings.length === 0) {
            return res.json({ success: true, listings: [] })
        }
        return res.json({ success: true, listings })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const getCredential = async (req, res) => {
    try {
        let { listingId } = req.params

        if (listingId.startsWith(":")) {
            listingId = listingId.slice(1)
        }

        const credential = await prisma.credential.findFirst({
            where: { listingId }
        })
        if (!credential) {
            return res.json({ success: false, message: "Listing not found" })
        }
        return res.json({ success: true, credential })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const markCredentialVerified = async (req, res) => {
    try {
        let { listingId } = req.params
        if (listingId.startsWith(":")) {
            listingId = listingId.slice(1)
        }
        const markVerified = await prisma.listing.update({
            where: { id: listingId },
            data: {
                isCredentialVerified: true
            }
        })
        return res.json({ success: true, markVerified, message: "Listing Verified Successfully" })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const getAllUnchangedListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                isCredentialVerified: true,
                isCredentialChanged: false,
                status: {
                    not: "deleted"
                }
            },
            orderBy: { createdAt: "desc" }
        })

        if (!listings || listings.length === 0) {
            return res.json({ success: true, listings: [] })
        }
        return res.json({ success: true, listings })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}


export const changeCredential = async (req, res) => {
    try {
        const { listingId } = req.params
        const { newCredential, credentialId } = req.body

        const credentialChanged = await prisma.credential.update({
            where: { id: credentialId, listingId },
            data: {
                updatedCredential: newCredential
            }
        })
        const updatedCredential = await prisma.listing.update({
            where: { id: listingId },
            data: {
                isCredentialChanged: true
            }
        })
        return res.json({ success: true, message: "Credential Changed Successfully" })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const getAllTransaction = async (req, res) => {
    try {
        const transaction = await prisma.transaction.findMany({
            where: { isPaid: true },
            orderBy: { createdAt: "desc" },
            include: {
                listing:
                {
                    include: { owner: true }
                }
            }
        })

        const customers = await prisma.user.findMany({
            where: { id: { in: transaction.map((transc) => transc.userId) } },
            select: { id: true, email: true, name: true, image: true }
        })
        transaction.forEach((t) => {
            const customer = customers.find((c) => c.id === t.userId)
            t.listing.customer = { ...customer }
        })

        return res.json({ success: true, transaction })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const getAllWithDrawRequests = async (req, res) => {
    try {
        const requests = await prisma.withdrawal.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: true }
        })

        if (!requests || requests.length === 0) {
            return res.json({ success: true, requests: [] })
        }
        return res.json({ success: true, requests })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const markWithDrawalsPaid = async (req, res) => {
    try {
        const { id } = req.params
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id }
        })
        if (!withdrawal) {
            return res.status(404).json({ success: false, message: "Withdrawal not found" })
        }
        if (withdrawal.isWithdrawn) {
            return res.status(200).json({ success: true, message: "Withdrawal is already marked as paid" })
        }
        const updatedisWithdrawn = await prisma.withdrawal.update({
            where: { id },
            data: { isWithdrawn: true }
        })

        return res.json({ success: true, message: "Withdrawal marked as paid" })


    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

