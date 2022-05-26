import mongoose from "mongoose";
import { Idea } from "../database/idea.model";
import { Upvote } from "../database/upvote.model";
import { IUser } from "../database/user.model";
import { DeleteUpvoteDto, UpvoteDatabaseResponse } from "../dtos/upvote.dto";
import { ClientError } from "../responses/error.response";

export class UpvoteService {
    constructor() {}

    getUpvoteByIdeaAndUser = async (
        ideaId: string,
        userId: string
    ): Promise<UpvoteDatabaseResponse | null> => {
        const upvote = await Upvote.findOne({ idea: ideaId, user: userId });
        return upvote;
    };

    /**
     * @name getUpvotesByIdea
     * @param {string} ideaId
     * @returns {}
     */
    getUpvotesByIdea = async (
        ideaId: string
    ): Promise<UpvoteDatabaseResponse[]> => {
        const upvotes = await Upvote.find({ idea: ideaId }).populate<{
            upvoter: IUser;
        }>(["upvoter"]);
        return upvotes;
    };

    getUpvotesByUser = async (
        userId: string
    ): Promise<UpvoteDatabaseResponse[]> => {
        const upvotes = await Upvote.find({ upvoter: userId }).populate<{
            upvoter: IUser;
        }>(["upvoter"]);
        return upvotes;
    };

    deleteUpvote = async (
        body: DeleteUpvoteDto
    ): Promise<UpvoteDatabaseResponse | null> => {
        let deletedUpvote = null;
        const upvoteToBeDeleted = await Upvote.findOne({
            idea: body.ideaId,
            downvoter: body.userId,
        });
        const idea = await Idea.findOne({ _id: body.ideaId });
        if (!upvoteToBeDeleted) {
            throw new ClientError({
                message: `you haven't upvoted yet`,
                context: "body",
                path: "ideaId,userId",
                helpers: ["try upvoting first"],
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
            await Upvote.deleteOne(
                {
                    upvoter: body.userId,
                    idea: body.ideaId,
                },
                { session }
            );
            idea.upvotes = idea.upvotes - 1;
            await idea.save({ session });
            deletedUpvote = upvoteToBeDeleted;
        });
        return deletedUpvote;
    };
}
