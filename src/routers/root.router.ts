import { Router } from "express";
import { AuthRouter } from "./auth.router";
import { DownvoteRouter } from "./downvote.router";
import { IdeaRouter } from "./idea.router";
import { TagRouter } from "./tag.router";
import { TargetRouter } from "./target.router";
import { UpvoteRouter } from "./upvote.router";
import { UserRouter } from "./user.router";

export const RootRouter = Router();

RootRouter.get("/", (req, res) => {
    res.status(200).send("✔️ Server is running fine");
});

RootRouter.use("/users", UserRouter);

RootRouter.use("/ideas", IdeaRouter);

RootRouter.use("/upvotes", UpvoteRouter);

RootRouter.use("/downvotes", DownvoteRouter);

RootRouter.use("/tags", TagRouter);

RootRouter.use("/targets", TargetRouter);

RootRouter.use("/auth", AuthRouter);

RootRouter.get("/*", (req, res) => {
    res.send("Undefined API");
});
