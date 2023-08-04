import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import {
  getAllUrlsByUser,
  getUrlsRank,
} from "../controllers/rank.controller.js";

const rankRouter = Router();

rankRouter.get("/users/me", validateAuth, getAllUrlsByUser);
rankRouter.get("/ranking", getUrlsRank);

export default rankRouter;
