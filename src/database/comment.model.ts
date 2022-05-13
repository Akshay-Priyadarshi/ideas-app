import { model, ObjectId, Schema } from "mongoose";
import { COMMENT_MODEL_NAME, USER_MODEL_NAME } from "../utils/constant.util";
import { titleCase } from "../utils/string.util";

export interface IComment {
    by: ObjectId;
    content: string;
}

const commentSchema = new Schema<IComment>(
    {
        by: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: USER_MODEL_NAME,
            select: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            get: titleCase,
            maxlength: 500,
            select: true,
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true, virtuals: true, aliases: true },
        toObject: { getters: true, virtuals: true, aliases: true },
    }
);

export const Comment = model(COMMENT_MODEL_NAME, commentSchema);
