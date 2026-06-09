import type { QueryFilter } from "mongoose";

export type MongoFilter<
	T extends Record<string, unknown> = Record<string, unknown>,
> = QueryFilter<T>;

export const buildDateRangeFilter = <T extends Record<string, unknown>>(
	createdBefore?: Date,
	createdAfter?: Date,
	fieldName: string = "createdAt",
): MongoFilter<T> => {
	const dateFilter: { $lte?: Date; $gte?: Date } = {};

	if (createdBefore) {
		const endOfDay = new Date(createdBefore);
		endOfDay.setHours(23, 59, 59, 999);
		dateFilter.$lte = endOfDay;
	}

	if (createdAfter) {
		dateFilter.$gte = createdAfter;
	}

	return Object.keys(dateFilter).length > 0
		? ({ [fieldName]: dateFilter } as MongoFilter<T>)
		: ({} as MongoFilter<T>);
};

export const buildSearchFilter = <T extends Record<string, unknown>>(
	search: string | undefined,
	searchFields: string[],
): MongoFilter<T> => {
	if (!search || searchFields.length === 0) {
		return {} as MongoFilter<T>;
	}

	const searchRegex = new RegExp(search, "i");
	return {
		$or: searchFields.map((field) => ({
			[field]: searchRegex,
		})),
	} as MongoFilter<T>;
};

export const mergeFilters = <T extends Record<string, unknown>>(
	...filters: MongoFilter<T>[]
): MongoFilter<T> => {
	const mergedFilter: Record<string, unknown> = {};
	const conditions: MongoFilter<T>[] = [];

	for (const filter of filters) {
		if (Object.keys(filter).length === 0) continue;

		if (filter.$or) {
			conditions.push({ $or: filter.$or } as MongoFilter<T>);
			continue;
		}

		Object.assign(mergedFilter, filter);
	}

	if (conditions.length > 0) {
		const baseConditions = Object.keys(mergedFilter).map((key) => ({
			[key]: mergedFilter[key],
		}));
		return {
			$and: [...baseConditions, ...conditions],
		} as MongoFilter<T>;
	}

	return mergedFilter as MongoFilter<T>;
};
