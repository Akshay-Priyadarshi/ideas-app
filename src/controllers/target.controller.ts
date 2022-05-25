import { NextFunction, Request, Response } from "express";
import { AppResponse } from "../responses/app.response";
import { AppSuccessResponse } from "../responses/success.response";
import { TargetService } from "../services/target.service";
import { getPaginationDataFromQuery } from "../utils/transform.util";

export class TargetController {
    constructor(private targetService = new TargetService()) {}

    getTargetCount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const targetCount = await this.targetService.getTargetCount();
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: targetCount,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    getAllTargets = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paginationData = getPaginationDataFromQuery(req.query);
            const targets = await this.targetService.getAllTargets(
                paginationData
            );
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: targets,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    getTargetById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const target = await this.targetService.getTargetById(
                req.params.targetId,
                true
            );
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: target,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    createTarget = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const target = await this.targetService.createTarget(req.body);
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: target,
                    message: `target successfully created`,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    updateTarget = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const target = await this.targetService.updateTarget(
                req.params.targetId,
                req.body
            );
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: target,
                    message: `target successfully updated`,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };

    deleteTarget = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const target = await this.targetService.deleteTarget(
                req.params.targetId
            );
            const appResponse = new AppResponse({
                reqPath: req.originalUrl,
                success: new AppSuccessResponse({
                    data: target,
                    message: `target successfully deleted`,
                }),
            });
            res.json(appResponse);
        } catch (err) {
            next(err);
        }
    };
}
