import { Downvote } from '../database/downvote.model'
import { IUser } from '../database/user.model'
import { DownvoteDatabaseResponse } from '../dtos/downvote.dto'

export class DownvoteService {
	constructor() {}

	getDownvoteByIdeaAndUser = async (
		ideaId: string,
		userId: string
	): Promise<DownvoteDatabaseResponse | null> => {
		const downvote = await Downvote.findOne({ idea: ideaId, user: userId })
		return downvote
	}

	getDownvotesByIdea = async (
		ideaId: string
	): Promise<DownvoteDatabaseResponse[]> => {
		const downvotes = await Downvote.find({ idea: ideaId }).populate<{
			downvoter: IUser
		}>(['downvoter'])
		return downvotes
	}

	getDownvotesByUser = async (
		userId: string
	): Promise<DownvoteDatabaseResponse[]> => {
		const downvotes = await Downvote.find({ downvoter: userId }).populate<{
			downvoter: IUser
		}>(['downvoter'])
		return downvotes
	}
}
