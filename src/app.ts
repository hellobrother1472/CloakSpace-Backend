import express from "express";
require('dotenv').config();
import pool from "../database/poolConfig";
const app = express();

app.get("/", (req,res)=>{
    res.send("This server is running successfully");
})

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log("server is up and running");
    
})