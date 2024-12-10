import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config()

const app = express()

const port = process.env.PORT || 3000
const username = process.env.DB_USER_NAME
const password = process.env.DB_PASSWORD
const dataBaseUrl = `mongodb://${username}:${password}@inshorts-shard-00-00.32xor.mongodb.net:27017,inshorts-shard-00-01.32xor.mongodb.net:27017,inshorts-shard-00-02.32xor.mongodb.net:27017/?ssl=true&replicaSet=atlas-z3v03z-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Inshorts`

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials:true
}))

app.use("/uploads/profiles",express.static("uploads/profiles"));

app.use("/uploads/files",express.static("uploads/files"))
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/contacts',contactsRoutes)
app.use('/api/messages',messagesRoutes)
app.use('/api/channel',channelRoutes)

const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

setupSocket(server)

mongoose.connect(dataBaseUrl).then(()=>console.log("db connection successful")).catch((error)=>console.log(error.message))
