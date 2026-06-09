import type { Pagination } from "@common/schemas";

interface PaginationResponse {
	foundCount: number;
	totalCount: number;
	page: number;
	limit: number;
}

export const generatePagination = (
	foundCount: number,
	totalCount: number,
	pagination: Pagination,
): PaginationResponse => {
	return {
		foundCount,
		totalCount,
		page: pagination.page + 1,
		limit: pagination.limit,
	};
};
