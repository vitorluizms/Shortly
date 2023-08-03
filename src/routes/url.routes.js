import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import {
  deleteUrl,
  getUrlById,
  redirectUser,
  shortenUrl,
} from "../controllers/url.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { urlSchema } from "../schemas/main.schemas.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateAuth, validateSchema(urlSchema), shortenUrl);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl", redirectUser);
urlRouter.delete("urls/:id", validateAuth, deleteUrl);

export default urlRouter;