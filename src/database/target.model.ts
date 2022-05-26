import { Schema, model } from "mongoose";
import { TARGET_MODEL_NAME } from "../utils/constant.util";
import { titleCase } from "../utils/string.util";

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
            unique: true,
            get: titleCase,
        },
    },
    {
        toJSON: { getters: true, virtuals: true, aliases: true },
        toObject: { getters: true, virtuals: true, aliases: true },
        id: false,
    }
);

export const Target = model(TARGET_MODEL_NAME, targetSchema);
