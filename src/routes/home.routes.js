import { Router } from "express";
import { getAllItems } from "../controllers/home.controller.js";

const homeRouter = Router();

homeRouter.get("/all-items", getAllItems);

export default homeRouter;
