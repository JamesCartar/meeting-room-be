import type { AdminSchemaType } from "@db/models/admin.model";
import type { AdminGetAllInput } from "@validators/schemas/admin.schema";
import type { QueryFilter } from "mongoose";
import {
	buildDateRangeFilter,
	buildSearchFilter,
	type MongoFilter,
	mergeFilters,
} from "../filter.util";

export const buildAdminFilter = (
	query: Partial<AdminGetAllInput>,
): QueryFilter<AdminSchemaType> => {
	const filters: MongoFilter<AdminSchemaType>[] = [];

	if (query.search) {
		filters.push(
			buildSearchFilter<AdminSchemaType>(query.search, ["name", "email"]),
		);
	}

	const dateFilter = buildDateRangeFilter(
		query.createdBefore,
		query.createdAfter,
	);
	if (Object.keys(dateFilter).length > 0) {
		filters.push(dateFilter);
	}

	const fieldFilters: MongoFilter<AdminSchemaType> = {};

	if (query.role) {
		fieldFilters.role = query.role;
	}

	if (query.status) {
		fieldFilters.status = query.status;
	}

	if (Object.keys(fieldFilters).length > 0) {
		filters.push(fieldFilters);
	}

	return mergeFilters<AdminSchemaType>(...filters);
};
