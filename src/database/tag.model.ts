import { Schema, model } from "mongoose";
import { TAG_MODEL_NAME } from "../utils/constant.util";

export interface ITag {
    name: string;
}

const tagSchema = new Schema<ITag>(
    {
        name: {
            type: String,
            trim: true,
            lowerCase: true,
            select: true,
        },
    },
    {
        toJSON: { getters: true, virtuals: true, aliases: true },
        toObject: { getters: true, virtuals: true, aliases: true },
    }
);

export const Tag = model(TAG_MODEL_NAME, tagSchema);
