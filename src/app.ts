import express,{ Request, Response } from "express";
import bodyParser from "body-parser";
require('dotenv').config();
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const corsOptions = {
    origin : true,
    credentials: true
} 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req:Request,res:Response)=>{
    res.send("This server is running successfully");
})

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log("server is up and running");
    
})