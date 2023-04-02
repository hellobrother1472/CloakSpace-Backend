import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user ?: any;
}

const authUserMiddleware =async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {

        const token = req.cookies.jwt;
        const decode = await jwt.verify(token,process.env.JWT_SECRET as string);
        // console.log(decode);
        if(!decode) {
            res.status(401).send({ message: "Login First" })
            return;
        }
        req.user = decode;
        next();
        
    } catch (error) {
        return res.status(404).send({error:error.message});
    }
}

export default authUserMiddleware;