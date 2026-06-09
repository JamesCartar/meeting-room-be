export abstract class HttpError extends Error {
	public status: number;
	public bodyStatus: number | undefined;

	constructor(status: number, message?: string, bodyStatus?: number) {
		super(message);

		this.status = status;
		this.bodyStatus = bodyStatus;

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = this.constructor.name;
	}
}
