import { HttpError } from "./http.error";

export class BadRequestError extends HttpError {
	constructor(
		message: string = "Bad request",
		name: string = "Bad request error",
		status: number = 400,
	) {
		super(status, message);
		this.name = name;
	}
}
