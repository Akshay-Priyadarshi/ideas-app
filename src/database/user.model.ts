import { Model, model, Schema } from "mongoose";
import { USER_MODEL_NAME } from "../utils/constant.util";
import { encryptPassword } from "../utils/password.util";
import { IProfile, profileSchema } from "./profile.schema";

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface IUser {
    email: string;
    password: string;
    role: UserRole;
    verified: boolean;
    profile: IProfile;
}

export interface UserQueryHelpers {}

export interface IUserModel extends Model<IUser, UserQueryHelpers> {}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            select: true,
            required: [true, "email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            select: false,
            trim: true,
            set: encryptPassword,
            required: [true, "password is required"],
        },
        role: {
            type: String,
            select: true,
            trim: true,
            uppercase: true,
            enum: UserRole,
            default: UserRole.USER,
        },
        verified: { type: Boolean, default: false, select: true },
        profile: { type: profileSchema, select: true },
    },
    {
        timestamps: true,
        toJSON: { getters: true, virtuals: true, aliases: true },
        toObject: { getters: true, virtuals: true, aliases: true },
    }
);

export const User = model<IUser, IUserModel>(USER_MODEL_NAME, userSchema);
