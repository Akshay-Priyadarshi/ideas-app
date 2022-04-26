import { Router } from "express";
import { IdeaController } from "../controllers/idea.controller";
import { AuthenticationMiddleware } from "../middlewares/auth.middleware";

export const IdeaRouter = Router();
const ideaController = new IdeaController();

IdeaRouter.get("/my/:userId", ideaController.getIdeaByUserId);

IdeaRouter.get("/count", ideaController.getIdeaCount);

IdeaRouter.get("/", AuthenticationMiddleware(), ideaController.getAllIdeas);

IdeaRouter.get("/:ideaId", ideaController.getIdeaById);

IdeaRouter.post("/", ideaController.createIdea);

IdeaRouter.put("/:ideaId", ideaController.updateIdea);

IdeaRouter.delete("/:ideaId", ideaController.deleteIdea);

IdeaRouter.post("/downvote", ideaController.downvoteIdea);

IdeaRouter.post("/upvote", ideaController.upvoteIdea);
