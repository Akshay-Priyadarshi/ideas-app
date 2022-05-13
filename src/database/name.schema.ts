import { Schema } from "mongoose";
import { titleCase } from "../utils/string.util";

export interface IName {
    first: string;
    middle: string | undefined;
    last: string;
}

export const nameSchema = new Schema<IName>(
    {
        first: {
            type: String,
            required: [true, "first name is required"],
            trim: true,
            lowercase: true,
            get: titleCase,
        },
        middle: { type: String, trim: true, lowercase: true, get: titleCase },
        last: {
            type: String,
            required: [true, "last name is required"],
            trim: true,
            lowercase: true,
            get: titleCase,
        },
    },
    {
        _id: false,
        toJSON: { getters: true, virtuals: true, aliases: true },
        toObject: { getters: true, virtuals: true, aliases: true },
    }
);

nameSchema.virtual("full").get(function (this: IName) {
    return this.first + " " + this.last;
});
