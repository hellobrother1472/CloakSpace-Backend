import express, { Request, Response } from "express";
const router = express.Router();
import pool from "../database/poolConfig";
import authUserMiddleware from "../middleware/authUserMiddleware";
import { AuthenticatedRequest } from "../types";
import {addVoteInteraction,alterVoteInteraction,deleteVoteInteraction} from "../utils/upvoteAndDownvoteFunctions";

router.post("/vote",authUserMiddleware, async (req: AuthenticatedRequest, res: Response) => {
		try {
			const user_id:string = req.user.id;
			const { post_id, isLiked } = req.body;

			// Checking if already have interaction record or not
			const isAlreadyInteracted = await pool.query(
				"SELECT EXISTS(SELECT * FROM votes WHERE post_id=$1 AND user_id=$2)",
				[post_id, user_id]
			);

			// If Already Interacted (means upvoted or downvoted).
			if (isAlreadyInteracted.rows[0].exists) {
				const isUpvoted:boolean = isAlreadyInteracted.rows[0].isupvoted; // database record
				if(isLiked === isUpvoted){
					// If they are equal that means user is undoing what is done previously
					// Deleting record and altering votes count
					const change:number = (isLiked) ? -1 : 1;
					const operationRes = await deleteVoteInteraction(user_id,post_id,change);
					if (operationRes) res.status(200).send({ message: "Sucess" });
				}
				else{		
					// If they are not equal that means user is doing opposite to previous interaction.
					const change:number = (isLiked) ? 2 : -2;		
					const operationRes = await alterVoteInteraction(user_id,post_id,change,isLiked);
					if (operationRes) res.status(200).send({ message: "Sucess" });
				}
			} else {
				//else insert a interaction in votes table and change votes count in post table and set votes status
				const change:number = (isLiked) ? 1 : -1;
				const operationRes = await addVoteInteraction(user_id,post_id,change,isLiked);
				if (operationRes) res.status(200).send({ message: "Sucess" });
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: "Internal server error occured" });
		}
	}
);

router.post("/postComment",async (req:Request,res:Response)=>{
	const client = await pool.connect();
    try {
        const{post_id,user_id,comment_content} = req.body;
		await client.query("BEGIN");
        await client.query('INSERT INTO comments(post_id,user_id,comment) VALUES ($1,$2,$3)',[post_id,user_id,comment_content]);
        await client.query(`UPDATE posts SET comments_count = comments_count + 1 WHERE post_id=${post_id};`);
        await client.query("COMMIT");
        res.status(200).send({message : 'Successfully posted'});        
    } catch (error) {
        console.log(error);  
		await client.query("ROLLBACK");
        res.status(500).send({ message: "Unable to post" })     
    }
    
})
