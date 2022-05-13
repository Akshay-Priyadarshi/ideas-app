import mongoose from "mongoose";
import { Idea } from "../database/idea.model";
import { User } from "../database/user.model";
import { PaginationDto } from "../dtos/pagination.dto";
import {
    CreateUserDto,
    UpdateUserDto,
    UserDatabaseResponse,
    UserPasswordResetDto,
} from "../dtos/user.dto";
import {
    AppErrorResponse,
    ClientError,
    ClientErrorContext,
} from "../responses/error.response";
import { ENV_VERIFY_USER_SECRET } from "../utils/constant.util";
import { getPayloadFromJwt } from "../utils/jwt.util";
import { verifyPassword } from "../utils/password.util";

export class UserService {
    constructor() {}

    /**
     * @name getUserCount
     * @returns {Promise<number>} Number of users
     * @description Returns the number of users in the User collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    getUserCount = async (): Promise<number> => {
        const count = await User.count();
        return count;
    };

    /**
     * @name getAllUsers
     * @param {PaginationDto | undefined}  Pagination data
     * @returns {Promise<UserDatabaseResponse[]>} All users
     * @description Get all users from the user collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    getAllUsers = async (
        p?: PaginationDto
    ): Promise<UserDatabaseResponse[]> => {
        if (p) {
            const skip = (p.page - 1) * p.limit;
            if (skip > p.count) {
                return [];
            }
            const users = await User.find(
                {},
                {},
                { skip: skip, limit: p.limit }
            );
            return users;
        } else {
            const users = await User.find();
            return users;
        }
    };

    /**
     * @name getUserById
     * @param {string} id User id
     * @returns {Promise<UserDatabaseResponse | null>} User
     * @description Get user with specified id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    getUserById = async (id: string): Promise<UserDatabaseResponse | null> => {
        const user = await User.findOne({ _id: id });
        return user;
    };

    /**
     * @name getCompleteUserByEmail
     * @param {string} email Email of the user
     * @returns {Promise<UserDatabaseResponse> | null>} Login credentials of the user
     * @description Fetches the user corresponding to an email
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    getCompleteUserByEmail = async (
        email: string
    ): Promise<UserDatabaseResponse | null> => {
        const user = await User.findOne({ email }).select({
            password: 1,
        });
        return user;
    };

    /**
     * @name getCompleteUserById
     * @param {string} id
     * @returns {Promise<UserDatabaseResponse | null>}
     * @description Returns complete user corresponding to the id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    getCompleteUserById = async (
        id: string
    ): Promise<UserDatabaseResponse | null> => {
        const user = await User.findOne({ _id: id }).select({
            password: 1,
        });
        return user;
    };

    /**
     * @name createUser
     * @param {CreateUserDto} createUserDto Object for creating user
     * @returns {Promise<UserDatabaseResponse | null | undefined} Created user
     * @description Create a user with specified user object
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    createUser = async (
        createUserDto: CreateUserDto
    ): Promise<UserDatabaseResponse | null> => {
        const userWithEmail = await this.getCompleteUserByEmail(
            createUserDto.email
        );
        if (userWithEmail != null) {
            throw new ClientError({
                message: "email already registered",
                context: ClientErrorContext.BODY,
                path: "email",
            });
        }
        const newUser = await User.create(createUserDto);
        const savedUser = await newUser.save();
        return await this.getUserById(savedUser.id);
    };

    /**
     * @name updatedUser
     * @param {string} id Id of the user to be updated
     * @param {UpdateUserDto} updateUserDto User fields to be updated
     * @returns {Promise<UserDatabaseResponse | null | undefined>} Updated user
     * @description Updates user with the given user id and returns updated user
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    updateUser = async (
        id: string,
        updateUserDto: UpdateUserDto
    ): Promise<UserDatabaseResponse | null | undefined> => {
        const updateResult = await User.updateOne({ _id: id }, updateUserDto, {
            runValidators: true,
        });
        if (updateResult.modifiedCount == 1) {
            const updatedUser = await this.getUserById(id);
            return updatedUser;
        }
    };

    /**
     * @name deletedUser
     * @param {string} id User Id
     * @returns {Promise<UserDatabaseResponse | null | undefined>} Deleted user
     * @description Deletes the user corresponding to the user id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    deleteUser = async (id: string): Promise<UserDatabaseResponse> => {
        const deletedUser = await this.getUserById(id);
        if (!deletedUser) {
            throw new AppErrorResponse({
                message: "could not delete user",
            });
        }
        await mongoose.connection
            .transaction(async function (session) {
                await Idea.deleteMany({ ideator: id }, { session });
                await User.deleteOne({ _id: id }, { session });
            })
            .catch((err) => {
                throw new AppErrorResponse({
                    message: "could not delete user",
                });
            });
        return deletedUser;
    };

    /**
     * @name resetUserPassword
     * @param id User id
     * @param passwordResetDto Combination of old and new password
     * @returns {Promise<boolean | undefined>} True if password reset is successful and false otherwise
     * @description Resets password of user with the specified user id, compares the old password, resets the password to the new value and returns true if successfully reset otherwise false
     * @author Akshay priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    resetUserPassword = async (
        id: string,
        passwordResetDto: UserPasswordResetDto
    ): Promise<boolean | undefined> => {
        if (passwordResetDto.new === passwordResetDto.old) {
            throw new ClientError({
                message: "new password must not be same as old password",
                context: ClientErrorContext.BODY,
                path: "new",
            });
        }
        const user = await this.getCompleteUserById(id);
        if (user) {
            if (verifyPassword(passwordResetDto.old, user.password)) {
                const updateResult = await user.updateOne(
                    { password: passwordResetDto.new },
                    { runValidators: true }
                );
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
            } else {
                throw new ClientError({
                    message: `your current password doesn't seem right`,
                    context: ClientErrorContext.BODY,
                    path: "old",
                });
            }
        }
        return false;
    };

    /**
     * @name verifyUserRedirect
     * @param {string} signedToken Signed JWT token
     * @returns {Promise<boolean | undefined>} If the verifu user redirect worked
     * @description Returns whether the user is verified or not based on the signed token passed
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi/>
     */
    verifyUserRedirect = async (
        signedToken: string
    ): Promise<boolean | undefined> => {
        let ifVerified = false;
        const jwtPayload = getPayloadFromJwt(
            signedToken,
            ENV_VERIFY_USER_SECRET
        );
        if (jwtPayload && jwtPayload.sub) {
            const user = await this.getUserById(jwtPayload.sub as string);
            if (user) {
                if (user.verified === true) {
                    throw new AppErrorResponse({
                        message: "user already verified",
                    });
                }
                await user.updateOne(
                    { verified: true },
                    { runValidators: true }
                );
                ifVerified = true;
            }
        }
        return ifVerified;
    };
}
