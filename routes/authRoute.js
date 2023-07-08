import express from "express";
import {registerController,
        loginController,
        testController
    } from "../controllers/authController.js";
import { isAdmin,requireSignIn } from "../middlewares/authMiddleware.js";

//Router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post('/register',registerController);

//LOGIN || POST
router.post('/login',loginController);

//Test
router.get('/test',requireSignIn, isAdmin,testController);

export default router;