import { BadRequestError, UnauthorizedError } from "../utils/customError.js"

export const roleMiddlware = (...roles)=>{
    return (req,res,next)=>{
          if(!roles.includes(req.user.role)){
             throw new BadRequestError("you can not access this route")
          }
          next()
    }
} 