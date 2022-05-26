import { Router } from "express";
import { DownvoteController } from "../controllers/downvote.controller";

export const DownvoteRouter = Router();

const downvoteController = new DownvoteController();

DownvoteRouter.delete("/", downvoteController.deleteDownvote);
