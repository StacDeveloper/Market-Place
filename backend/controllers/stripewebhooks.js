import Stripe from "stripe"
import prisma from "../configs/prisma.js";
import { inngest } from "../inngest/index.js";

export const stripeWebHook = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const endpointSecret = process.env.STRIPE_STRIPE_WEBHOOK_SECRET

    let event;
    if (endpointSecret) {
        const signature = req.headers["stripe-signatures"]
        try {
            event = stripeInstance.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            )
        } catch (error) {
            console.log(error)
            return res.json({ success: false, error })
        }
        try {
            switch (event.type) {
                case "payment_intent.succeeded":
                    const paymentIntent = event.data.object
                    const sessionList = await stripeInstance.checkout.sessions.list({
                        payment_intent: paymentIntent.id
                    })
                    const session = sessionList.data[0]
                    const { transactionId, appId } = session.metadata

                    if (appId === "Market-Place" && transactionId) {
                        const transaction = await prisma.transaction.update({
                            where: { id: transactionId },
                            data: {
                                isPaid: true
                            }
                        })

                        const sendPurchaseEmail = await inngest.send({ name: "app/purchase", data: { transaction } })
                        
                        const soldListing = await prisma.listing.update({
                            where: { id: transaction.listingId },
                            data: { status: "sold" }
                        })

                        const updateUserAmount = await prisma.user.update({
                            where: { id: transaction.ownerId },
                            data: { earned: { increment: transaction.amount } }
                        })


                    }
                    break
                default:
                    console.log(`Unhandled ${event.type}`)
                    break
            }
        } catch (error) {
            console.log(error)
            return res.json({ success: false, error })
        }
    }
}