import { NextFunction, Request, Response } from "express";
import { AppResponse } from "../responses/app.response";
import { AppSuccessResponse } from "../responses/success.response";
import { TagService } from "../services/tag.service";
import { getPaginationDataFromQuery } from "../utils/transform.util";

export class TagController {
    constructor(private tagService = new TagService()) {}

    getTagCount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tagCount = await this.tagService.getTagCount();
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: tagCount,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    getAllTags = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paginationData = getPaginationDataFromQuery(req.query);
            const tags = await this.tagService.getAllTags(paginationData);
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: tags,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    getTagById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idea = await this.tagService.getTagById(
                req.params.tagId,
                true
            );
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: idea,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    createTag = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tag = await this.tagService.createTag(req.body);
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: tag,
                    message: `tag successfully created`,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    updateTag = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tag = await this.tagService.updateTag(
                req.params.tagId,
                req.body
            );
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: tag,
                    message: `tag successfully updated`,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    deleteTag = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tag = await this.tagService.deleteTag(req.params.tagId);
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: tag,
                    message: `idea successfully deleted`,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };
}
