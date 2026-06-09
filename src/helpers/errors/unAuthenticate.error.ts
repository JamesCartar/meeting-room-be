import { HttpError } from "./http.error";

export class UnauthenticatedError extends HttpError {
	constructor(
		message: string = "Unauthenticated",
		bodyStatus: number = 401,
		status: number = 401,
		name: string = "Unauthenticated error",
	) {
		super(status, message, bodyStatus);
		this.name = name;
	}
}
