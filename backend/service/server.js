import express from "express"
import dotenv from "dotenv"
dotenv.config()


const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json())

app.get("/api/notification", () => {
    console.log(`Server is running`)
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))