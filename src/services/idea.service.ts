import { ClientSession } from 'mongoose'
import { Downvote } from '../database/downvote.model'
import { Idea } from '../database/idea.model'
import { IUser } from '../database/user.model'
import { CreateDownvoteDto } from '../dtos/downvote.dto'
import {
	CreateIdeaDto,
	IdeaDatabaseResponse,
	UpdateIdeaDto,
} from '../dtos/idea.dto'
import { PaginationDto } from '../dtos/pagination.dto'

export class IdeaService {
	constructor() {}

	/**
	 * @name getIdeaCount
	 * @returns {Promise<number>} Idea count
	 * @description Returns count of ideas in Idea collection
	 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
	 */
	getIdeaCount = async (): Promise<number> => {
		const ideaCount = await Idea.count()
		return ideaCount
	}

	/**
	 * @name getAllIdeas
	 * @param {PaginationDto | undefined} p  Pagination data
	 * @returns {Promise<IdeaDatabaseResponse[]>} All ideas
	 * @description Returns all ideas from Idea collection
	 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
	 */
	getAllIdeas = async (p?: PaginationDto): Promise<IdeaDatabaseResponse[]> => {
		if (p) {
			const skip = (p.page - 1) * p.limit
			if (skip > p.count) {
				return []
			}
			return await Idea.find({}, {}, { skip, limit: p.limit })
		}
		return await Idea.find()
	}

	/**
	 * @name getIdeaById
	 * @param {string} id Idea id
	 * @param {boolean} complete Complete or not
	 * @returns {Promise<IdeaDatabaseResponse | null>} Returns Idea corresponding to the provided id
	 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
	 */
	getIdeaById = async (
		id: string,
		complete?: boolean
	): Promise<IdeaDatabaseResponse | null> => {
		let idea
		if (complete == true) {
			idea = await Idea.findOne({ _id: id }).populate<{ ideator: IUser }>([
				'ideator',
			])
		} else {
			idea = await Idea.findOne({ _id: id })
		}
		return idea
	}

	/**
	 * @name createdIdea
	 * @param {CreateIdeaDto} createIdeaDto Object for creating idea
	 * @returns {Promise<IdeaDatabaseResponse} Created idea
	 * @description Returns created idea from the provided object
	 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
	 */
	createIdea = async (
		createIdeaDto: CreateIdeaDto
	): Promise<IdeaDatabaseResponse> => {
		const createdIdea = await Idea.create(createIdeaDto)
		const savedIdea = await createdIdea.save()
		return savedIdea
	}

	/**
	 * @name updateIdea
	 * @param {string} id Idea id
	 * @param {UpdateIdeaDto} updateIdeaDto Object for updating idea
	 * @returns {Promise<IdeaDatabaseResponse | null | undefined>} Updated idea
	 * @description Returns updated idea from provided id and object
	 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
	 */
	updateIdea = async (
		id: string,
		updateIdeaDto: UpdateIdeaDto
	): Promise<IdeaDatabaseResponse | null | undefined> => {
		const updateResult = await Idea.updateOne({ _id: id }, updateIdeaDto)
		if (updateResult.modifiedCount > 0) {
			return this.getIdeaById(id)
		}
	}

	/**
	 * @name deleteIdea
	 * @param {string} id Idea id
	 * @returns {Promise<IdeaDatabaseResponse | null | undefined>} Deleted idea
	 * @description Returns deleted idea from provided id
	 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
	 */
	deleteIdea = async (
		id: string
	): Promise<IdeaDatabaseResponse | null | undefined> => {
		const toBeDeleted = await this.getIdeaById(id)
		if (toBeDeleted != null) {
			const deleteResult = await Idea.deleteOne({ _id: id })
			if (deleteResult.deletedCount > 0) {
				return toBeDeleted
			}
		}
	}

	downvoteIdea = async (
		createDownvoteDto: CreateDownvoteDto
	): Promise<boolean> => {
		const createdDownvote = await Downvote.create(createDownvoteDto)
		let downvoted = false
		await Downvote.db
			.transaction(async (session: ClientSession) => {
				const idea = await this.getIdeaById(createDownvoteDto.idea.toString())
				// const similarUpvote = await this.upvoteService.getUpvoteByIdeaAndUser(
				// 	createDownvoteDto.idea.toString(),
				// 	createDownvoteDto.downvoter.toString()
				// )
				// if (similarUpvote != null) {
				// 	similarUpvote.deleteOne({ session })
				// }
				if (idea) {
					idea.downvote()
					createdDownvote.save({ session })
					idea.save({ session })
				}
			})
			.then(() => {
				downvoted = true
			})
			.catch(() => {
				downvoted = false
			})
		return downvoted
	}
}
