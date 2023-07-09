import pool from "../database/poolConfig";

export const deleteVoteInteraction =async (user_id:string, post_id:string, change:number) => {
    const client = await pool.connect();
	try {
		await client.query("BEGIN");

		// Delete row from votes table
		await client.query(
			"DELETE FROM votes WHERE post_id=$1 AND user_id=$2",
			[post_id, user_id]
		);

		// Update votes column of post table.
		await client.query(
			"UPDATE posts SET votes = votes + $1 WHERE post_id=$2 AND user_id=$3",
			[change, post_id, user_id]
		);

		await client.query("COMMIT");
		return true;
	} catch (error) {
		console.log(error);
		await client.query("ROLLBACK");
		return new Error("Unable to delete vote interaction");
	} finally {
		client.release();
	}
}

export const addVoteInteraction =async (user_id:string, post_id:string, change:number, isLiked:boolean) => {
    const client = await pool.connect();
	try {
		await client.query("BEGIN");

		// Insert into votes table
		await client.query(
			"INSERT INTO votes(user_id, post_id, isupvoted) VALUES ($1,$2,$3)",
			[user_id, post_id,isLiked]
		);

		// Update votes column of post table.
		await client.query(
			"UPDATE posts SET votes = votes + $1 WHERE post_id=$2 AND user_id=$3",
			[change, post_id, user_id]
		);

		await client.query("COMMIT");
		return true;
	} catch (error) {
		console.log(error);
		await client.query("ROLLBACK");
		return new Error("Unable to add vote interaction");
	} finally {
		client.release();
	}
}

export const alterVoteInteraction =async (user_id:string, post_id:string, change:number, isLiked:boolean) => {
    const client = await pool.connect();
	try {
		await client.query("BEGIN");

		// Alter votes table
		await client.query(
			"UPDATE votes SET isupvoted = $1 WHERE post_id=$2 AND user_id=$3",
			[isLiked ,user_id, post_id]
		);

		// Update votes column of post table.
		await client.query(
			"UPDATE posts SET votes = votes + $1 WHERE post_id=$2 AND user_id=$3",
			[change, post_id, user_id]
		);

		await client.query("COMMIT");
		return true;
	} catch (error) {
		console.log(error);
		await client.query("ROLLBACK");
		return new Error("Unable to add vote interaction");
	} finally {
		client.release();
	}
}

