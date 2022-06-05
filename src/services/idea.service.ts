import { Downvote } from "../database/downvote.model";
import { Idea } from "../database/idea.model";
import { User } from "../database/user.model";
import { CreateDownvoteDto } from "../dtos/downvote.dto";
import { CreateUpvoteDto } from "../dtos/upvote.dto";
import {
    CreateIdeaDto,
    IdeaDatabaseResponse,
    UpdateIdeaDto,
} from "../dtos/idea.dto";
import mongoose, { ClientSession } from "mongoose";
import { PaginationDto } from "../dtos/pagination.dto";
import { Upvote } from "../database/upvote.model";
import {
    AppErrorResponse,
    AuthorizationError,
    ClientError,
} from "../responses/error.response";
import { UserDatabaseResponse } from "../dtos/user.dto";

export class IdeaService {
    constructor() {}

    /**
     * @name getIdeaCount
     * @returns {Promise<number>} Idea count
     * @description Returns count of ideas in Idea collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getIdeaCount = async (): Promise<number> => {
        const ideaCount = await Idea.count();
        return ideaCount;
    };

    /**
     * @name getAllIdeas
     * @param {PaginationDto | undefined} p  Pagination data
     * @returns {Promise<IdeaDatabaseResponse[]>} All ideas
     * @description Returns all ideas from Idea collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getAllIdeas = async (
        loggedInUser: UserDatabaseResponse,
        p?: PaginationDto
    ): Promise<IdeaDatabaseResponse[]> => {
        const upvotedIdeasId = await Upvote.find({
            upvoter: loggedInUser._id,
        }).transform((docs) => {
            const ids = docs.map((doc) => {
                return doc.idea;
            });
            return ids;
        });
        const downvotedIdeasId = await Downvote.find({
            downvoter: loggedInUser._id,
        }).transform((docs) => {
            const ids = docs.map((doc) => {
                return doc.idea;
            });
            return ids;
        });
        const addFieldIfIUpvoted = {
            $addFields: {
                ifIUpvoted: {
                    $in: ["$_id", upvotedIdeasId],
                },
            },
        };
        const addFieldIfIDownvoted = {
            $addFields: {
                ifIDownvoted: {
                    $in: ["$_id", downvotedIdeasId],
                },
            },
        };
        let aggregatedIdeas = null;
        if (p) {
            const skip = (p.page - 1) * p.limit;
            if (skip > p.count) {
                return [];
            }

            aggregatedIdeas = await Idea.aggregate([
                { $skip: skip },
                { $limit: p.limit },
                addFieldIfIUpvoted,
                addFieldIfIDownvoted,
            ]);
        } else {
            aggregatedIdeas = await Idea.aggregate([
                addFieldIfIUpvoted,
                addFieldIfIDownvoted,
            ]);
        }
        const ideas = await Idea.populate(aggregatedIdeas, { path: "ideator" });
        return ideas;
    };

    /**
     * @name getIdeaById
     * @param {string} id Idea id
     * @param {UserDatabaseResponse} loggedInUser Logged in user
     * @returns {Promise<IdeaDatabaseResponse | null>} Returns Idea corresponding to the provided id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getIdeaById = async (
        id: string,
        loggedInUser: UserDatabaseResponse
    ): Promise<IdeaDatabaseResponse | null> => {
        const upvotedIdeasId = await Upvote.find({
            upvoter: loggedInUser._id,
        }).transform((docs) => {
            const ids = docs.map((doc) => {
                return doc.idea;
            });
            return ids;
        });
        const downvotedIdeasId = await Downvote.find({
            downvoter: loggedInUser._id,
        }).transform((docs) => {
            const ids = docs.map((doc) => {
                return doc.idea;
            });
            return ids;
        });
        const addFieldIfIUpvoted = {
            $addFields: {
                ifIUpvoted: {
                    $in: ["$_id", upvotedIdeasId],
                },
            },
        };
        const addFieldIfIDownvoted = {
            $addFields: {
                ifIDownvoted: {
                    $in: ["$_id", downvotedIdeasId],
                },
            },
        };
        const aggregatedIdeas = await Idea.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$_id", new mongoose.Types.ObjectId(id)],
                    },
                },
            },
            addFieldIfIUpvoted,
            addFieldIfIDownvoted,
        ]);
        const ideas = await Idea.populate(aggregatedIdeas, { path: "ideator" });
        return ideas[0] as IdeaDatabaseResponse;
    };

    getIdeaByUserId = async (
        id: string
    ): Promise<IdeaDatabaseResponse[] | null> => {
        const userIdeas = await Idea.find({ ideator: id });
        return userIdeas;
    };

    /**
     * @name createdIdea
     * @param {CreateIdeaDto} createIdeaDto Object for creating idea
     * @returns {Promise<IdeaDatabaseResponse} Created idea
     * @description Returns created idea from the provided object
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    createIdea = async (
        createIdeaDto: CreateIdeaDto,
        loggedInUser: UserDatabaseResponse
    ): Promise<IdeaDatabaseResponse | null> => {
        const ideator = await User.findOne({
            _id: createIdeaDto.ideator,
        });
        if (!ideator) {
            throw new AppErrorResponse({
                message: `ideator doesn't exist`,
            });
        }
        const createdIdea = await Idea.create(createIdeaDto);
        const savedIdea = await createdIdea.save();
        const idea = await this.getIdeaById(savedIdea.id, loggedInUser);
        return idea as IdeaDatabaseResponse;
    };

    /**
     * @name updateIdea
     * @param {string} id Idea id
     * @param {UpdateIdeaDto} updateIdeaDto Object for updating idea
     * @returns {Promise<IdeaDatabaseResponse | null | undefined>} Updated idea
     * @description Returns updated idea from provided id and object
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    updateIdea = async (
        id: string,
        updateIdeaDto: UpdateIdeaDto,
        loggedInUser: UserDatabaseResponse
    ): Promise<IdeaDatabaseResponse | null | undefined> => {
        const ideaToBeUpdated = await Idea.findOne({ _id: id });
        if (ideaToBeUpdated?.ideator !== loggedInUser.id) {
            throw new AuthorizationError({
                message: "you aren't authorized to perform this operation",
            });
        }
        const updateResult = await Idea.updateOne({ _id: id }, updateIdeaDto);
        if (updateResult.modifiedCount > 0) {
            return await this.getIdeaById(id, loggedInUser);
        }
    };

    /**
     * @name deleteIdea
     * @param {string} id Idea id
     * @returns {Promise<IdeaDatabaseResponse | null | undefined>} Deleted idea
     * @description Returns deleted idea from provided id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    deleteIdea = async (
        id: string,
        loggedInUser: UserDatabaseResponse
    ): Promise<IdeaDatabaseResponse | null | undefined> => {
        const toBeDeleted = await this.getIdeaById(id, loggedInUser);
        if (toBeDeleted != null) {
            const deleteResult = await Idea.deleteOne({ _id: id });
            if (deleteResult.deletedCount > 0) {
                return toBeDeleted;
            }
        }
    };

    downvoteIdea = async (
        createDownvoteDto: CreateDownvoteDto
    ): Promise<boolean> => {
        const createdDownvote = new Downvote({
            idea: createDownvoteDto.ideaId,
            downvoter: createDownvoteDto.userId,
        });
        let downvoted = false;
        const idea = await Idea.findOne({ _id: createDownvoteDto.ideaId });
        const similarUpvote = await Upvote.findOne({
            idea: createDownvoteDto.ideaId,
            upvoter: createDownvoteDto.userId,
        });
        const similarDownvote = await Downvote.findOne({
            idea: createDownvoteDto.ideaId,
            downvoter: createDownvoteDto.userId,
        });

        if (idea) {
            await mongoose.connection
                .transaction(async (session) => {
                    if (similarDownvote !== null) {
                        throw new AppErrorResponse({
                            message: `already downvoted`,
                        });
                    }
                    if (similarUpvote !== null) {
                        await similarUpvote.deleteOne({ session });
                        idea.upvotes = idea.upvotes - 1;
                    }
                    idea.downvotes = idea.downvotes + 1;
                    await idea.save({ session });
                    await createdDownvote.save({ session });
                })
                .then(() => {
                    downvoted = true;
                });
        }
        return downvoted;
    };

    upvoteIdea = async (createUpvoteDto: CreateUpvoteDto): Promise<boolean> => {
        const createdUpvote = new Upvote({
            idea: createUpvoteDto.ideaId,
            upvoter: createUpvoteDto.userId,
        });
        let upvoted = false;
        const idea = await Idea.findOne({ _id: createUpvoteDto.ideaId });
        const similarUpvote = await Upvote.findOne({
            idea: createUpvoteDto.ideaId,
            upvoter: createUpvoteDto.userId,
        });
        const similarDownvote = await Downvote.findOne({
            idea: createUpvoteDto.ideaId,
            downvoter: createUpvoteDto.userId,
        });
        if (idea) {
            await mongoose.connection
                .transaction(async (session: ClientSession) => {
                    if (similarUpvote !== null) {
                        throw new AppErrorResponse({
                            message: `already upvoted`,
                        });
                    }
                    if (similarDownvote !== null) {
                        await similarDownvote.deleteOne({ session });
                        idea.downvotes = idea.downvotes - 1;
                    }
                    idea.upvotes = idea.upvotes + 1;
                    await idea.save({ session });
                    await createdUpvote.save({ session });
                })
                .then(() => {
                    upvoted = true;
                });
        }
        return upvoted;
    };
}
