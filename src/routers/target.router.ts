import { Router } from "express";
import { TargetController } from "../controllers/target.controller";

export const TargetRouter = Router();
const targetController = new TargetController();

TargetRouter.get("/count", targetController.getTargetCount);

TargetRouter.get("/", targetController.getAllTargets);

TargetRouter.get("/:targetId", targetController.getTargetById);

TargetRouter.post("/", targetController.createTarget);

TargetRouter.put("/:targetId", targetController.updateTarget);

TargetRouter.delete("/:targetId", targetController.deleteTarget);
