import express from "express"
import "dotenv/config"
import cors from "cors"
import { clerkMiddleware } from "@clerk/express"
import { serve } from "inngest/express"
import { inngest, functions } from "./inngest/index.js"
import listingRouter from "./routes/listing.routes.js"
import chatRouter from "./routes/chat.routes.js"
import adminRouter from "./routes/admin.routes.js"


const app = express()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


app.use("/api/inngest", serve({ client: inngest, functions }));


app.use("/api/listing", listingRouter)
app.use("/api/chat", chatRouter)
app.use("/api/admin", adminRouter)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))