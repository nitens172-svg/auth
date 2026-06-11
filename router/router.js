import express from 'express';
const router = express.Router();
import {signUp,verifyUser,RefreshAccessToken, login,logOut,profile} from '../controller/controller.js';
import {logOutAuthMiddleware,auth} from '../middleware/auth.middleware.js';
import { roleMiddlware } from '../middleware/role.middleware.js';


router.post("/signUp",signUp);
router.get("/verify", verifyUser);
router.post("/login",login)
router.post("/refresh",RefreshAccessToken)
router.post("/logout",logOutAuthMiddleware,logOut)
router.get("/profile",auth,roleMiddlware("user"),profile)

export default router; 