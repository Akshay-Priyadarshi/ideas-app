import { Router } from "express";
import { TagController } from "../controllers/tag.controller";

export const TagRouter = Router();
const tagController = new TagController();

TagRouter.get("/count", tagController.getTagCount);

TagRouter.get("/", tagController.getAllTags);

TagRouter.get("/filter", tagController.getFilteredTags);

TagRouter.get("/:tagId", tagController.getTagById);

TagRouter.post("/", tagController.createTag);

TagRouter.put("/:tagId", tagController.updateTag);

TagRouter.delete("/:tagId", tagController.deleteTag);
