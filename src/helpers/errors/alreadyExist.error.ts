import { HttpError } from "./http.error";

export class AlreadyExistsError extends HttpError {
	constructor(
		message: string = "Resource already exists",
		name: string = "Already exist error",
	) {
		super(409, message);
		this.name = name;
	}
}
