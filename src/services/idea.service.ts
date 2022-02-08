import { Idea } from '../database/idea.model'
import { IUser } from '../database/user.model'
import {
	CreateIdeaDto,
	IdeaDatabaseResponse,
	UpdateIdeaDto,
} from '../dtos/idea.dto'
import { PaginationDto } from '../dtos/pagination.dto'

export class IdeaService {
	constructor() {}

	getIdeaCount = async (): Promise<number> => {
		const ideaCount = await Idea.count()
		return ideaCount
	}

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

	createIdea = async (
		createIdeaDto: CreateIdeaDto
	): Promise<IdeaDatabaseResponse> => {
		const createdIdea = await Idea.create(createIdeaDto)
		const savedIdea = await createdIdea.save()
		return savedIdea
	}

	updateIdea = async (
		id: string,
		updateIdeaDto: UpdateIdeaDto
	): Promise<IdeaDatabaseResponse | null | undefined> => {
		const updateResult = await Idea.updateOne({ _id: id }, updateIdeaDto)
		if (updateResult.modifiedCount > 0) {
			return this.getIdeaById(id)
		}
	}

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
}
