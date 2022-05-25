import { Document } from "mongoose";
import { ITag } from "../database/tag.model";

export type CreateTagDto = ITag;

export type UpdateTagDto = Partial<ITag>;

export interface TagDatabaseResponse extends ITag, Document {}
