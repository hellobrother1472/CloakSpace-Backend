import express, { Request, Response } from "express";
const router = express.Router();
import pool from "../database/poolConfig";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

router.post("/signUp", async (req: Request, res: Response) => {
	try {
		const { username, email, user_password } = req.body;

		// Checking if user already exist or not
		const checkUserPresence = await pool.query(
			"SELECT EXISTS(SELECT * FROM users WHERE email = $1)",
			[email]
		);
		if (checkUserPresence.rows[0].exists) {
			return res.status(400).send({ result: "User already exists" });
		}

		// If user does't exist make hash password and make new user
		const hashedPassword = await bcrypt.hash(user_password, saltRounds); // Hashing
		if (hashedPassword) {
			const result = await pool.query(
				"INSERT INTO users (username, email, user_password) VALUES ($1,$2,$3)",
				[username, email, hashedPassword]
			); // Inserting

			if (result.rowCount > 0) {
				res.status(200).send({ message: "Registered succesfully" }); // Message for success
			}
		} else {
			throw new Error("Unable to hash");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal server error occured" });
	}
});


router.post("/signIn", async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body;

    // Checking if their exist a user or not
    const user = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );
    if(user.rowCount === 0){
      return res.status(400).send({ message: "No user exist"});
    }

    // If exist then verifing the password.
    const verifyPassword = await bcrypt.compare(password, user.rows[0].user_password); 
    if(!verifyPassword) {
      return res.status(400).send({ message: "Incorrect Password"});
    }

    // If valid credentials
    const payload = user.rows[0];
    const token = await jwt.sign(payload,JWT_SECRET as string); // typecast because JWT_SECRET : undefined | string but jwt.sign only wants string.

    // Send the message and token.
    res.cookie("jwt", token);
    res.status(200).send({ result: "Login Successful"});

  } catch (error) {
    console.log(error.message);
		res.status(500).send({ message: "Internal server error occured" });
  }

});

router.get("/logout", (req:Request, res:Response) => {
    res.clearCookie('jwt');
    res.status(200).send({ message: 'Succesfully logged out.' });
})

export default router;
