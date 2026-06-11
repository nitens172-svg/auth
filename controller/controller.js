import asyncHandler from "../utils/asyncHandler.js";
import {signUpService,verifyEmailService,loginService,refreshAccessTokenService,logOutService} from "../services/auth.service.js";
import { BadRequestError,NotFoundError, UnauthorizedError } from "../utils/customError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

/* -------------------- controller for signUp --------------- */
export const signUp = asyncHandler(async (req,res,next)=>{
        const result = await signUpService(req.body);
        res.status(201).json({
        success:true,
        message:"User registered successfully! Please check your email to verify your account.",
        data: result
        })
    });

/* -------------------- controller for verifyUser --------------- */
export const verifyUser = asyncHandler(async (req,res,next)=>{
    const result = await verifyEmailService(req.query.token);
    
      res.status(200).json(result);
    
})
/* -------------------- controller for login --------------- */
export const login = asyncHandler(async (req,res,next)=>{
     const result = await loginService(req.body);
      
     res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
     })
  res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,    
  })
    res.status(200).json({
        success:true,
        message: result.message,
        data: {
            user: result.user
        }
        });
});
/* -------------------- controller for refresh Access Token --------------- */
export const RefreshAccessToken = asyncHandler(async(req,res)=>{
    const refreshToken = req.cookies.refreshToken
       console.log(refreshToken)
     if(!refreshToken){
         throw new BadRequestError("please check your refresh token")
     }
    const result = await refreshAccessTokenService(refreshToken)
       console.log(result)
                    res.cookie("refreshToken", result.newRefreshToken, {
                                 httpOnly: true,
                                 secure: process.env.NODE_ENV === "production",
                                sameSite: "strict",
                                 maxAge: 7 * 24 * 60 * 60 * 1000, 
                    })
                    res.cookie("accessToken", result.newAccessToken, {
                                 httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                                sameSite: "strict",
                                maxAge: 15 * 60 * 1000,    
                    })

                    res.status(200).json({
                        success:true,
                        message:"access token refreshed successfully",
                    })
})

/* -------------------- controller for logOut --------------- */

export const logOut = asyncHandler(async(req,res)=>{
      const user = req.user
      if(!user){
          throw new UnauthorizedError("you cannot access to it ")
      }
      console.log(user)
    const result = await logOutService(user)
       res
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: true
        })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully",
            data:result.user
        });
     
})

export  const profile = (req,res)=>{
   res.send("welcome on profile page")
 }

