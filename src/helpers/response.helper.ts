import type {
	ErrorDetail,
	ErrorResponse,
	SuccessResponse,
} from "@customTypes/response";
import type { Request, Response } from "express";

export const successResponse = (
	res: Response,
	message: string,
	data?: object,
	status: number = 200,
) => {
	const responseObj: SuccessResponse = {
		success: true,
		message: message,
		status,
		...(data && { data }),
	};

	return res.status(status).json(responseObj);
};

export const errorResponse = (
	_req: Request,
	res: Response,
	message: string,
	status: number = 500,
	details?: ErrorDetail[],
	bodyStatus?: number,
) => {
	const responseObj: ErrorResponse = {
		success: false,
		status: bodyStatus ?? status,
		message: message,
		...(details && { details }),
	};

	return res.status(status).json(responseObj);
};
