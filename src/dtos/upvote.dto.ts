import { Document } from "mongoose";
import { IUpvote } from "../database/upvote.model";

export interface CreateUpvoteDto {
    userId: string;
    ideaId: string;
}

export type DeleteUpvoteDto = CreateUpvoteDto;

export interface UpvoteDatabaseResponse extends IUpvote, Document {}
