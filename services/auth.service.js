import { BadRequestError, UnauthorizedError } from "../utils/customError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { resolveContent } from "nodemailer/lib/shared/index.js";
import { roleMiddlware } from "../middleware/role.middleware.js";


/* -------------------- logic for signUp user --------------- */
const signUpService = async ({ userName, email, password,role }) => {
  // what if userName, email or password one of them or two are empty then show err;
  if (!userName || !email || !password || !role) {
    throw new BadRequestError("All fields are required");
  }
  

  const existingUser = await User.findOne({
    email,
  });

  console.log(existingUser)
  if (existingUser) {
    throw new BadRequestError("User already exists with this email");
  }
  const user = await User.create({
    userName,
    email,
    password,
    role
  });
  const token = await user.generateVerificationToken();
  user.verificationToken=token
  await user.save();
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Welcome to Our App! verify your email`,
      text: `${process.env.BASE_URL}${process.env.PORT}/verify?token=${token}`,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
  }
};


/* -------------------- logic for verifiction token for login --------------- */
const verifyEmailService = async (token) => {
  if (!token) {
    throw new BadRequestError("Verification token is required");
  }
  // some work to be done remain left 
  const decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);
  console.log("Decoded token:", decoded);
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new BadRequestError("please check your email");
  }

  if (token !== user.verificationToken) {
    throw new BadRequestError("please check incoming token");
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();
  return {
    success: true,
    message: "Email verified successfully! You can now log in to your account.",
    data: user,
  };
};

/* -------------------- logic for login --------------- */

const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }
  // get full user using email
  const user = await User.findOne({ email }).select("+password");
  console.log("User found:", user);
  if (!user) {
    throw new NotFoundError("User not found with this email");
  }
  if (!user.isVerified) {
    throw new BadRequestError("Please verify your email before logging in");
  }
  //  used bcrypt method here 
  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    throw new BadRequestError("Invalid email or password");
  }

  const refreshToken = await user.generateRefreshToken()
  const accessToken = await user.generateAccessToken()
  user.refreshToken = refreshToken;
  await user.save();
  return {
    refreshToken,
    accessToken,
    user: { email: user.email, userName: user.userName },
    message: "Login successful",
  };
};


/* -------------------- logic for refresh access token--------------- */
const refreshAccessTokenService = async (token) => {
  if (!token) {
    throw new BadRequestError("token is required");
  }
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  console.log(decoded);
  if (!decoded) {
    throw new BadRequestError("TokenExpired");
  }
  const user = await User.findOne({ email: decoded.email }).select(
    "+refreshToken",
  );
  if (!user) {
    throw new NotFoundError("please checK your token");
  }
  
  console.log(user.refreshToken);

  if (token !== user.refreshToken) {
    throw new UnauthorizedError("provided token does not match");
  } else {
    const newRefreshToken = await user.generateRefreshToken()
    const newAccessToken = await user.generateAccessToken()

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      newAccessToken,
      newRefreshToken,
    };
  }
};

/* -------------------- logic for logout service --------------- */

 const logOutService = async({email})=>{
   if(!email){
     throw new BadRequestError("please check your access token")
   }
   const user = await User.findOne({email});
      user.refreshToken = null;
      await user.save()

      return{
           user
      }
 }

export {
  signUpService,
  verifyEmailService,
  loginService,
  refreshAccessTokenService,
  logOutService
};
