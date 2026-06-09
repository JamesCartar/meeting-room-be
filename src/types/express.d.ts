import type { Pagination } from "@common/schemas";
import type { Actor } from "@utils/abac.util";
import type { TokenPayload } from "./request";

declare global {
	namespace Express {
		interface Request {
			validatedQuery?: unknown;
			jwt?: TokenPayload;
			actor?: Actor;
			pagination?: Pagination;
		}
	}
}
