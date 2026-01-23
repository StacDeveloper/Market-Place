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