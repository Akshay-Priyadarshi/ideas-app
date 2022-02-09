import { Downvote } from '../database/downvote.model'
import { Idea } from '../database/idea.model'
import { IUser } from '../database/user.model'
import { CreateDownvoteDto } from '../dtos/downvote.dto'
import { CreateUpvoteDto } from '../dtos/upvote.dto'
import {
	CreateIdeaDto,
	IdeaDatabaseResponse,
	UpdateIdeaDto,
} from '../dtos/idea.dto'
import mongoose, { ClientSession } from 'mongoose'
import { PaginationDto } from '../dtos/pagination.dto'
import { Upvote } from '../database/upvote.model'
import { AppErrorResponse } from '../responses/error.response'
import { UserDatabaseResponse } from '../dtos/user.dto'

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
	getAllIdeas = async (
		loggedInUser: UserDatabaseResponse,
		p?: PaginationDto
	): Promise<IdeaDatabaseResponse[]> => {
		const upvotedIdeasId = await Upvote.find({
			upvoter: loggedInUser._id,
		}).transform((docs) => {
			const ids = docs.map((doc) => {
				return doc.idea
			})
			return ids
		})
		const downvotedIdeasId = await Downvote.find({
			downvoter: loggedInUser._id,
		}).transform((docs) => {
			const ids = docs.map((doc) => {
				return doc.idea
			})
			return ids
		})
		const addFieldIfIUpvoted = {
			$addFields: {
				ifIUpvoted: {
					$in: ['$_id', upvotedIdeasId],
				},
			},
		}
		const addFieldIfIDownvoted = {
			$addFields: {
				ifIDownvoted: {
					$in: ['$_id', downvotedIdeasId],
				},
			},
		}
		if (p) {
			const skip = (p.page - 1) * p.limit
			if (skip > p.count) {
				return []
			}

			const ideas = await Idea.aggregate([
				{ $skip: skip },
				{ $limit: p.limit },
				addFieldIfIUpvoted,
				addFieldIfIDownvoted,
			])
			return ideas
		} else {
			const ideas = await Idea.aggregate([
				addFieldIfIUpvoted,
				addFieldIfIDownvoted,
			])
			return ideas
		}
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
		const createdDownvote = new Downvote({
			idea: createDownvoteDto.ideaId,
			downvoter: createDownvoteDto.userId,
		})
		let downvoted = false
		const idea = await this.getIdeaById(createDownvoteDto.ideaId)
		const similarUpvote = await Upvote.findOne({
			idea: createDownvoteDto.ideaId,
			upvoter: createDownvoteDto.userId,
		})
		const similarDownvote = await Downvote.findOne({
			idea: createDownvoteDto.ideaId,
			downvoter: createDownvoteDto.userId,
		})

		if (idea) {
			await mongoose.connection
				.transaction(async (session) => {
					if (similarDownvote !== null) {
						throw new AppErrorResponse({
							message: `already downvoted`,
						})
					}
					if (similarUpvote !== null) {
						await similarUpvote.deleteOne({ session })
						idea.upvotes = idea.upvotes - 1
					}
					idea.downvotes = idea.downvotes + 1
					await idea.save({ session })
					await createdDownvote.save({ session })
				})
				.then(() => {
					downvoted = true
				})
		}
		return downvoted
	}

	upvoteIdea = async (createUpvoteDto: CreateUpvoteDto): Promise<boolean> => {
		const createdUpvote = new Upvote({
			idea: createUpvoteDto.ideaId,
			upvoter: createUpvoteDto.userId,
		})
		let upvoted = false
		const idea = await this.getIdeaById(createUpvoteDto.ideaId)
		const similarUpvote = await Upvote.findOne({
			idea: createUpvoteDto.ideaId,
			upvoter: createUpvoteDto.userId,
		})
		const similarDownvote = await Downvote.findOne({
			idea: createUpvoteDto.ideaId,
			downvoter: createUpvoteDto.userId,
		})
		if (idea) {
			await mongoose.connection
				.transaction(async (session: ClientSession) => {
					if (similarUpvote !== null) {
						throw new AppErrorResponse({
							message: `already upvoted`,
						})
					}
					if (similarDownvote !== null) {
						await similarDownvote.deleteOne({ session })
						idea.downvotes = idea.downvotes - 1
					}
					idea.upvotes = idea.upvotes + 1
					await idea.save({ session })
					await createdUpvote.save({ session })
				})
				.then(() => {
					upvoted = true
				})
		}
		return upvoted
	}
}
