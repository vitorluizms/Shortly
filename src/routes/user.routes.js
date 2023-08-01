import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/signup", signUp)
userRouter.post("/signIn", signIn)

export default userRouter;
