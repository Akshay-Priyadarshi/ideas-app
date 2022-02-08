import { Upvote } from '../database/upvote.model'
import { IUser } from '../database/user.model'
import { UpvoteDatabaseResponse } from '../dtos/upvote.dto'

export class UpvoteService {
	constructor() {}

	getUpvoteByIdeaAndUser = async (
		ideaId: string,
		userId: string
	): Promise<UpvoteDatabaseResponse | null> => {
		const upvote = await Upvote.findOne({ idea: ideaId, user: userId })
		return upvote
	}

	/**
	 * @name getUpvotesByIdea
	 * @param {string} ideaId
	 * @returns {}
	 */
	getUpvotesByIdea = async (
		ideaId: string
	): Promise<UpvoteDatabaseResponse[]> => {
		const upvotes = await Upvote.find({ idea: ideaId }).populate<{
			upvoter: IUser
		}>(['upvoter'])
		return upvotes
	}

	getUpvotesByUser = async (
		userId: string
	): Promise<UpvoteDatabaseResponse[]> => {
		const upvotes = await Upvote.find({ upvoter: userId }).populate<{
			upvoter: IUser
		}>(['upvoter'])
		return upvotes
	}
}
