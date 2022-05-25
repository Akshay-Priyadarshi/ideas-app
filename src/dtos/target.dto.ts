import { Document } from "mongoose";
import { ITarget } from "../database/target.model";

export type CreateTargetDto = ITarget;

export type UpdateTargetDto = Partial<ITarget>;

export interface TargetDatabaseResponse extends ITarget, Document {}
