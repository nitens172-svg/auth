import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role:{
      type:String,
      enum:["user","admin"],
      required:true,
      default:"user"
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    refreshToken:{
         type:String,
         default:null,
         select:false
    }
  },
  { timestamps: true },
);

userSchema.pre("save",async function () {
  if(!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password,10)
   
}) 

userSchema.methods.isPasswordCorrect = async function (password){
  //  it returns true or false
     return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function () {
   return jwt.sign(
       {
         _id:this._id,
         email:this.email,
         role:this.role
       }, 
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
       }
       
   )
}
userSchema.methods.generateVerificationToken = async function () {
   return jwt.sign(
       {
         _id:this._id,
         email:this.email
       }, 
       process.env.VERIFICATION_TOKEN_SECRET,
       {
        expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY
       }
       
   )
}

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
       {
         _id:this._id,
         email:this.email,
         role:this.role
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
       }
       
   )
} 
export const User = mongoose.model("User", userSchema);
