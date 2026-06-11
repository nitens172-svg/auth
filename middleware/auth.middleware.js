import { User } from "../models/user.model.js";
import { BadRequestError,NotFoundError,UnauthorizedError } from "../utils/customError.js";
import jwt, { decode } from "jsonwebtoken"

const logOutAuthMiddleware = async(req, res, next) => {
    try{
        
    const token = req.cookies.refreshToken;
     console.log(token)
     
    if(!token){
         throw new NotFoundError("Access denied No token provided ")
    }

    const verified = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
     if(!verified){
        throw new UnauthorizedError("token expired ")
     }

     req.user = verified
     next()

    }catch(err){
        next(err)
    }
    
}

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken;
        console.log(token)
    if(!token){
        throw new UnauthorizedError("token is required");
    }
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    console.log(decoded)
     if(!decoded){
         throw new UnauthorizedError("access token is expired ")
     }
    req.user = decoded
    next()
    } catch (error) {
          next(error)
    }
    
}
export {logOutAuthMiddleware,auth};