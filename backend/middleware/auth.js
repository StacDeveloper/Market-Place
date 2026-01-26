import { clerkClient } from "@clerk/express"

export const protectRoute = async (req, res, next) => {
    try {
        const { userId, has } = await req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not Authorized" })
        }
        const hasPremiumPlan = await has({ plan: "premium" })
        req.plan = hasPremiumPlan ? 'premium' : 'free'
        return next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, error })
    }
}
export const protectAdmin = async (req, res, next) => {
    try {
        const user  = await clerkClient.users.getUser(await req.auth().userId)
        const isAdmin = process.env.ADMIN_EMAIL.includes(user.emailAddresses[0].emailAddress)

        if (!isAdmin) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, error })
    }
}