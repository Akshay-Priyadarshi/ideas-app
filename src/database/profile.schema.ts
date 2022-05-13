import { Schema } from "mongoose";
import { getRandomAvatarUrl } from "../utils/avatar.util";
import { dobSchema, IDob } from "./dob.schema";
import { IName, nameSchema } from "./name.schema";

export interface IProfile {
    name: IName;
    avatarUrl: string;
    dob: IDob;
}

export const profileSchema = new Schema<IProfile>(
    {
        name: nameSchema,
        dob: dobSchema,
        avatarUrl: { type: String, default: getRandomAvatarUrl() },
    },
    {
        timestamps: true,
        _id: false,
        toJSON: { getters: true, virtuals: true, aliases: true },
        toObject: { getters: true, virtuals: true, aliases: true },
    }
);
