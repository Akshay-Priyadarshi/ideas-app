import { NextFunction, Request, Response } from "express";
import { AppResponse } from "../responses/app.response";
import { AppErrorResponse } from "../responses/error.response";
import { AppSuccessResponse } from "../responses/success.response";
import { DownvoteService } from "../services/downvote.service";

export class DownvoteController {
    constructor(private downvoteService = new DownvoteService()) {}

    deleteDownvote = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const deletedDownvote = await this.downvoteService.deleteDownvote(
                req.body
            );
            if (deletedDownvote) {
                const appResponse = new AppResponse({
                    reqPath: req.originalUrl,
                    success: new AppSuccessResponse({
                        data: deletedDownvote,
                        message: "downvote successfully deleted",
                    }),
                });
                res.json(appResponse);
            } else {
                throw new AppErrorResponse({
                    message: `couldn't delete downvote`,
                });
            }
        } catch (err) {
            next(err);
        }
    };
}
