import { model, ObjectId, Schema } from "mongoose";
import {
    FAVOURITE_MODEL_NAME,
    IDEA_MODEL_NAME,
    USER_MODEL_NAME,
} from "../utils/constant.util";

export interface IFavourite {
    idea: ObjectId;
    user: ObjectId;
}

const favouriteSchema = new Schema<IFavourite>(
    {
        idea: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: IDEA_MODEL_NAME,
            select: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: USER_MODEL_NAME,
            select: true,
        },
    },
    { timestamps: true }
);

favouriteSchema.index({ idea: 1, user: 1 }, { name: "idea-user" });

export const Favourite = model(FAVOURITE_MODEL_NAME, favouriteSchema);
