import mongoose from "mongoose";
import { Downvote } from "../database/downvote.model";
import { Idea } from "../database/idea.model";
import { IUser } from "../database/user.model";
import {
    DeleteDownvoteDto,
    DownvoteDatabaseResponse,
} from "../dtos/downvote.dto";
import { ClientError } from "../responses/error.response";

export class DownvoteService {
    constructor() {}

    getDownvoteByIdeaAndUser = async (
        ideaId: string,
        userId: string
    ): Promise<DownvoteDatabaseResponse | null> => {
        const downvote = await Downvote.findOne({ idea: ideaId, user: userId });
        return downvote;
    };

    getDownvotesByIdea = async (
        ideaId: string
    ): Promise<DownvoteDatabaseResponse[]> => {
        const downvotes = await Downvote.find({ idea: ideaId }).populate<{
            downvoter: IUser;
        }>(["downvoter"]);
        return downvotes;
    };

    getDownvotesByUser = async (
        userId: string
    ): Promise<DownvoteDatabaseResponse[]> => {
        const downvotes = await Downvote.find({ downvoter: userId }).populate<{
            downvoter: IUser;
        }>(["downvoter"]);
        return downvotes;
    };

    deleteDownvote = async (
        body: DeleteDownvoteDto
    ): Promise<DownvoteDatabaseResponse | null> => {
        let deletedDownvote = null;
        const downvoteToBeDeleted = await Downvote.findOne({
            idea: body.ideaId,
            downvoter: body.userId,
        });
        const idea = await Idea.findOne({ _id: body.ideaId });
        if (!downvoteToBeDeleted) {
            throw new ClientError({
                message: `you haven't downvoted yet`,
                context: "body",
                path: "ideaId,userId",
                helpers: ["try downvoting first"],
            });
        }
        if (!idea) {
            throw new ClientError({
                message: "invalid idea id",
                context: "body",
                path: "ideaId",
            });
        }
        await mongoose.connection.transaction(async (session) => {
            await Downvote.deleteOne(
                {
                    downvoter: body.userId,
                    idea: body.ideaId,
                },
                { session }
            );
            idea.downvotes = idea.downvotes - 1;
            await idea.save({ session });
            deletedDownvote = downvoteToBeDeleted;
        });
        return deletedDownvote;
    };
}
