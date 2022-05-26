import { Document } from "mongoose";
import { IDownvote } from "../database/downvote.model";

export interface CreateDownvoteDto {
    userId: string;
    ideaId: string;
}

export type DeleteDownvoteDto = CreateDownvoteDto;

export interface DownvoteDatabaseResponse extends IDownvote, Document {}
