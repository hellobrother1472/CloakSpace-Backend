import express,{ Request, Response } from "express";
import bodyParser from "body-parser";
require('dotenv').config();
import cors from "cors";
import cookieParser from "cookie-parser";

import authUserMiddleware from "../middleware/authUserMiddleware";
import { AuthenticatedRequest } from "../middleware/authUserMiddleware";

import authRoutes from '../routes/authRoutes';
import postRoutes from '../routes/postRoutes';
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

app.use('/api/auth',authRoutes);
app.use('/api/posts',postRoutes);

app.get("/",authUserMiddleware, (req:AuthenticatedRequest,res:Response)=>{
    res.send(req.user);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("server is up and running");
})