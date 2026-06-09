import { BadRequestError } from "@helpers/errors";

type ErrorInput = Error | (() => Error);

export const assertDefined = <T>(
	value: T | null | undefined,
	error: ErrorInput = new BadRequestError("Required value is missing"),
): T => {
	if (value == null) {
		throw typeof error === "function" ? error() : error;
	}

	return value;
};
