import { Router } from "express";
import { UpvoteController } from "../controllers/upvote.controller";

export const UpvoteRouter = Router();

const upvoteController = new UpvoteController();

UpvoteRouter.delete("/", upvoteController.deleteUpvote);
