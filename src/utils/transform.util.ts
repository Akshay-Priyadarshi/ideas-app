import { Query } from 'express-serve-static-core'
import lodash from 'lodash'
import { PaginationDto } from '../dtos/pagination.dto'

/**
 * @name getPaginationDataFromQuery
 * @param {Query} query Request query
 * @returns {PaginationDto} Pagination data
 * @description Returns pagination data from the express request query
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
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
