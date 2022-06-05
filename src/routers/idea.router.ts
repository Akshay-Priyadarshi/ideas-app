import { Router } from "express";
import { IdeaController } from "../controllers/idea.controller";
import { AuthenticationMiddleware } from "../middlewares/auth.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { createIdeaVS } from "../validation/idea.validation";

export const IdeaRouter = Router();
const ideaController = new IdeaController();

IdeaRouter.get("/my/:userId", ideaController.getIdeaByUserId);

IdeaRouter.get("/count", ideaController.getIdeaCount);

IdeaRouter.get("/", AuthenticationMiddleware(), ideaController.getAllIdeas);

IdeaRouter.get(
    "/:ideaId",
    AuthenticationMiddleware(),
    ideaController.getIdeaById
);

IdeaRouter.post(
    "/",
    AuthenticationMiddleware(),
    ValidationMiddleware(createIdeaVS),
    ideaController.createIdea
);

IdeaRouter.put(
    "/:ideaId",
    AuthenticationMiddleware(),
    ideaController.updateIdea
);

IdeaRouter.delete(
    "/:ideaId",
    AuthenticationMiddleware(),
    ideaController.deleteIdea
);

IdeaRouter.post(
    "/downvote",
    AuthenticationMiddleware(),
    ideaController.downvoteIdea
);

IdeaRouter.post(
    "/upvote",
    AuthenticationMiddleware(),
    ideaController.upvoteIdea
);
