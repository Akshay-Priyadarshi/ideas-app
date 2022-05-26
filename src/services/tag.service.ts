import { PaginationDto } from "../dtos/pagination.dto";
import { ClientError } from "../responses/error.response";
import { Tag } from "../database/tag.model";
import {
    CreateTagDto,
    TagDatabaseResponse,
    UpdateTagDto,
} from "../dtos/tag.dto";

export class TagService {
    constructor() {}

    /**
     * @name getTagCount
     * @returns {Promise<number>} Tag count
     * @description Returns count of tags in Tag collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getTagCount = async (): Promise<number> => {
        const tagCount = await Tag.count();
        return tagCount;
    };

    /**
     * @name getAllTags
     * @param {PaginationDto | undefined} p  Pagination data
     * @returns {Promise<TagDatabaseResponse[]>} All tags
     * @description Returns all tags from Tag collection
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getAllTags = async (
        p?: PaginationDto
    ): Promise<TagDatabaseResponse[] | undefined> => {
        const tags = await Tag.find();
        return tags;
    };

    getFilteredTags = async (
        name: string
    ): Promise<TagDatabaseResponse[] | undefined> => {
        const tags = await Tag.find();
        const filteredTags = tags.filter((tag) => tag.name.includes(name));
        return filteredTags;
    };

    /**
     * @name getTagById
     * @param {string} id Tag id
     * @param {boolean} complete Complete or not
     * @returns {Promise<TagDatabaseResponse | null>} Returns Tag corresponding to the provided id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    getTagById = async (
        id: string,
        complete?: boolean
    ): Promise<TagDatabaseResponse | null> => {
        const tag = await Tag.findOne({ _id: id });
        return tag;
    };

    /**
     * @name createTag
     * @param {CreateTagDto} createTagDto Object for creating tag
     * @returns {Promise<TagDatabaseResponse>} Created tag
     * @description Returns created tag from the provided object
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    createTag = async (
        createTagDto: CreateTagDto
    ): Promise<TagDatabaseResponse> => {
        const searchRes = await Tag.findOne({
            name: createTagDto.name,
        });
        if (searchRes) {
            throw new ClientError({
                message: `tag already exists`,
                context: "body",
                path: "name",
            });
        }
        const createdTag = await Tag.create(createTagDto);
        const savedTag = await createdTag.save();
        return savedTag;
    };

    /**
     * @name updateTag
     * @param {string} id Tag id
     * @param {UpdateTagDto} updateTagDto Object for updating tag
     * @returns {Promise<TagDatabaseResponse | null | undefined>} Updated tag
     * @description Returns updated tag from provided id and object
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    updateTag = async (
        id: string,
        updateTagDto: UpdateTagDto
    ): Promise<TagDatabaseResponse | null | undefined> => {
        const updateResult = await Tag.updateOne({ _id: id }, updateTagDto, {
            runValidators: true,
        });
        if (updateResult.modifiedCount > 0) {
            const updatedTag = await this.getTagById(id);
            return updatedTag;
        }
    };

    /**
     * @name deleteTag
     * @param {string} id Tag id
     * @returns {Promise<TagDatabaseResponse | null | undefined>} Deleted tag
     * @description Returns deleted tag from provided id
     * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
     */
    deleteTag = async (
        id: string
    ): Promise<TagDatabaseResponse | null | undefined> => {
        const toBeDeleted = await this.getTagById(id);
        if (toBeDeleted != null) {
            const deleteResult = await toBeDeleted.delete();
            if (deleteResult.deletedCount > 0) {
                return toBeDeleted;
            }
        }
    };
}
