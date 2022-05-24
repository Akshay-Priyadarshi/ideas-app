import { Schema, model } from "mongoose";
import { TARGET_MODEL_NAME } from "../utils/constant.util";

export interface ITarget {
    name: string;
}

const targetSchema = new Schema<ITarget>(
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

export const Target = model(TARGET_MODEL_NAME, targetSchema);
