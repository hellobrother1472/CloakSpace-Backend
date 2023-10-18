import express ,{ Request,Response } from "express";
import pool from "../database/poolConfig";
import upload from '../utils/multer';
import {uploadToCloudinary} from "../utils/cloudinary";
import authUserMiddleware from "../middleware/authUserMiddleware";
const router = express.Router();


router.post("/post",upload.single('image'),async (req:Request,res:Response)=>{
    try {
        const{post_id,user_id,post_content} = req.body;
        const file = req.file;
        let url:string|undefined = undefined;
        if (file) {
            let result = await uploadToCloudinary(file.path, file.originalname);
            if(result) url = result?.url
        }
        if(url!=undefined){
            await pool.query('INSERT INTO posts(user_id,post,pic_url) VALUES ($1,$2,$3)',[user_id,post_content,url]);
        }        
        else await pool.query('INSERT INTO posts(user_id,post) VALUES ($1,$2)',[user_id,post_content]);
        res.status(200).send({message : 'Successfully posted'});        
    } catch (error) {
        console.log(error);  
        res.status(500).send({ message: "Unable to post" })     
    }
    
})

export default router