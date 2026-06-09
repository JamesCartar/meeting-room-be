import { HttpError } from "@helpers/errors/http.error";
import { errorResponse } from "@helpers/response.helper";
import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from "express";
import type mongoose from "mongoose"; 
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
	error,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.log(error);

	if (error instanceof ZodError) {
		const message = "Validation error";
		const status = 400;
		const details = error.issues.map((error) => ({
			field:
				error.code === "unrecognized_keys"
					? error.keys.join(", ")
					: error.path.join("."),
			issue: error.message,
		}));
		errorResponse(req, res, message, status, details);
	} else if (error instanceof HttpError) {
		const message = error.name;
		const status = error.status;
		const bodyStatus = error.bodyStatus;
		const details = [
			{
				field: req.url.split("/")[3], // accessing resource name from url
				issue: error.message,
			},
		];
		errorResponse(req, res, message, status, details, bodyStatus);
	} else if (error.name === "ValidationError") {
		const message = "Validation error";
		const status = 400;
		const details = Object.values(error.errors).map((err) => {
			const validatorError = err as mongoose.Error.ValidatorError;
			return {
				field: validatorError.path,
				issue: validatorError.message,
			};
		});
		errorResponse(req, res, message, status, details);
	} else if (error.name === "CastError") {
		const message = "Invalid data format";
		const status = 400;
		const details = [
			{
				field: error.path,
				issue: `Invalid value for ${error.path}`,
			},
		];
		errorResponse(req, res, message, status, details);
	} else if (error.name === "MongoServerError" && error.code === 11000) {
		const message = "Already exist error";
		const status = 409;
		const details = Object.keys(error.keyValue).map((field) => ({
			field,
			issue: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
		}));
		errorResponse(req, res, message, status, details);
	} else if (error.name === "TokenExpiredError") {
		const message = "Token expired error";
		const status = 401;
		const details = [
			{
				issue: "Token expired. Login again",
				field: req.url.split("/")[3],
			},
		];
		errorResponse(req, res, message, status, details);
	} else if (error.name === "JsonWebTokenError") {
		const message = "Json web token error";
		const status = 401;
		const details = [
			{
				issue: "Invalid token. Login again",
				field: req.url.split("/")[3],
			},
		];
		errorResponse(req, res, message, status, details);
	} else {
		console.log(error);
		const message = "Something went wrong";
		const status = 500;
		errorResponse(req, res, message, status);
	}
};
