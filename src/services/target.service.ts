import { PaginationDto } from "../dtos/pagination.dto";
import { ClientError } from "../responses/error.response";
import { Target } from "../database/target.model";
import {
    CreateTargetDto,
    TargetDatabaseResponse,
    UpdateTargetDto,
} from "../dtos/target.dto";

export class TargetService {
    constructor() {}

    /**
     * @name getTargetCount
     * @returns {Promise<number>} Target count
     * @description Returns count of Targets in Target collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getTargetCount = async (): Promise<number> => {
        const targetCount = await Target.count();
        return targetCount;
    };

    /**
     * @name getAllTargets
     * @param {PaginationDto | undefined} p  Pagination data
     * @returns {Promise<TargetDatabaseResponse[]>} All Targets
     * @description Returns all Targets from Target collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getAllTargets = async (
        p?: PaginationDto
    ): Promise<TargetDatabaseResponse[] | undefined> => {
        const targets = await Target.find();
        return targets;
    };

    /**
     * @name getTargetById
     * @param {string} id Target id
     * @param {boolean} complete Complete or not
     * @returns {Promise<TargetDatabaseResponse | null>} Returns Target corresponding to the provided id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getTargetById = async (
        id: string,
        complete?: boolean
    ): Promise<TargetDatabaseResponse | null> => {
        const target = await Target.findOne({ _id: id });
        return target;
    };

    /**
     * @name createTarget
     * @param {CreateTargetDto} createTargetDto Object for creating Target
     * @returns {Promise<TargetDatabaseResponse>} Created Target
     * @description Returns created Target from the provided object
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    createTarget = async (
        createTargetDto: CreateTargetDto
    ): Promise<TargetDatabaseResponse> => {
        const searchRes = await Target.findOne({
            name: createTargetDto.name,
        });
        if (searchRes) {
            throw new ClientError({
                message: `target already exists`,
                context: "body",
                path: "name",
            });
        }
        const createdTarget = await Target.create(createTargetDto);
        const savedTarget = await createdTarget.save();
        return savedTarget;
    };

    /**
     * @name updateTarget
     * @param {string} id Target id
     * @param {UpdateTargetDto} updateTargetDto Object for updating Target
     * @returns {Promise<TargetDatabaseResponse | null | undefined>} Updated Target
     * @description Returns updated Target from provided id and object
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    updateTarget = async (
        id: string,
        updateTargetDto: UpdateTargetDto
    ): Promise<TargetDatabaseResponse | null | undefined> => {
        const updateResult = await Target.updateOne(
            { _id: id },
            updateTargetDto
        );
        if (updateResult.modifiedCount > 0) {
            return await this.getTargetById(id);
        }
    };

    /**
     * @name deleteTarget
     * @param {string} id Target id
     * @returns {Promise<TargetDatabaseResponse | null | undefined>} Deleted Target
     * @description Returns deleted Target from provided id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    deleteTarget = async (
        id: string
    ): Promise<TargetDatabaseResponse | null | undefined> => {
        const toBeDeleted = await this.getTargetById(id);
        if (toBeDeleted != null) {
            const deleteResult = await toBeDeleted.delete();
            if (deleteResult.deletedCount > 0) {
                return toBeDeleted;
            }
        }
    };
}
