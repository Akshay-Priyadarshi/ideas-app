import { Query } from 'express-serve-static-core'
import lodash from 'lodash'
import { PaginationDto } from '../dtos/pagination.dto'

export const getPaginationDataFromQuery = (
	query: Query
): PaginationDto | undefined => {
	if (lodash.isEmpty(query)) {
		return undefined
	}
	const paginationData: PaginationDto = {
		page: Number(query.page),
		limit: Number(query.limit),
		count: Number(query.count),
	}
	return paginationData
}
