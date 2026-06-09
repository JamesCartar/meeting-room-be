import { HttpError } from "./http.error";

export class NotFoundError extends HttpError {
	constructor(
		message: string = "Resource not found",
		name: string = "Not found error",
	) {
		super(404, message);
		this.name = name;
	}
}
