import express from 'express';
const app = express();
 import router from './router/router.js';
 import globalErrorHandler from './middleware/globalError.middleware.js';
 import dotenv from 'dotenv';
 dotenv.config();
  import cookieParser from "cookie-parser";
 import {connectDB} from './config/dbConnection.js';
connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', router);
 app.use(globalErrorHandler);

app.listen(process.env.PORT || 3000, ()=>{
     console.log(`Server is running on port ${process.env.PORT || 3000}`);
})