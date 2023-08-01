import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import {
  deleteUrl,
  getUrlById,
  redirectUser,
  shortenUrl,
} from "../controllers/url.controller.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateAuth, shortenUrl);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl", redirectUser);
urlRouter.delete("urls/:id", validateAuth, deleteUrl);

export default urlRouter;