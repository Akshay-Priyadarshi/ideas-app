import { model, Schema } from "mongoose";
import {
    IDEA_MODEL_NAME,
    TAG_MODEL_NAME,
    TARGET_MODEL_NAME,
    USER_MODEL_NAME,
} from "../utils/constant.util";
import { titleCase } from "../utils/string.util";

export interface IIdea {
    title: string;
    desc: string;
    tags: Schema.Types.ObjectId[];
    targets: Schema.Types.ObjectId[];
    upvotes: number;
    downvotes: number;
    ideator: Schema.Types.ObjectId;
}

const ideaSchema = new Schema<IIdea>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            select: true,
            get: titleCase,
            minlength: 3,
            maxlength: 100,
        },
        upvotes: { type: Number, select: true, default: 0 },
        downvotes: { type: Number, select: true, default: 0 },
        desc: {
            type: String,
            required: true,
            lowercase: true,
            get: titleCase,
            trim: true,
            select: true,
            minlength: 100,
            maxlength: 1000,
        },
        tags: {
            type: [Schema.Types.ObjectId],
            ref: TAG_MODEL_NAME,
            select: true,
            default: [],
        },
        targets: {
            type: [Schema.Types.ObjectId],
            ref: TARGET_MODEL_NAME,
            select: true,
            default: [],
        },
        ideator: {
            type: Schema.Types.ObjectId,
            ref: USER_MODEL_NAME,
            required: true,
            select: true,
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true, virtuals: true, aliases: true },
        toObject: { getters: true, virtuals: true, aliases: true },
    }
);

export const Idea = model(IDEA_MODEL_NAME, ideaSchema);
