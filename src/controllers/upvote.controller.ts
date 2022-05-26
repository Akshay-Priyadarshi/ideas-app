import { NextFunction, Request, Response } from "express";
import { AppResponse } from "../responses/app.response";
import { AppErrorResponse } from "../responses/error.response";
import { AppSuccessResponse } from "../responses/success.response";
import { UpvoteService } from "../services/upvote.service";

export class UpvoteController {
    constructor(private upvoteService = new UpvoteService()) {}

    deleteUpvote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deletedUpvote = await this.upvoteService.deleteUpvote(
                req.body
            );
            if (deletedUpvote) {
                const appResponse = new AppResponse({
                    reqPath: req.originalUrl,
                    success: new AppSuccessResponse({
                        data: deletedUpvote,
                        message: "upvote successfully deleted",
                    }),
                });
                return res.json(appResponse);
            } else {
                throw new AppErrorResponse({
                    message: `couldn't delete upvote`,
                });
            }
        } catch (err) {
            next(err);
        }
    };
}
