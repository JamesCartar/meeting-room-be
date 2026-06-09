import type { NextFunction, Request, Response } from "express";
import mongoose, { type ClientSession } from "mongoose";

type AsyncController<R extends Request> = (
	_req: R,
	_res: Response,
) => Promise<unknown> | unknown;
type AsyncControllerWithTx<R extends Request> = (
	_req: R,
	_res: Response,
	_session: ClientSession,
) => Promise<unknown> | unknown;

export const controllerAsyncHandler = <R extends Request>(
	callback: AsyncController<R>,
) => {
	return async (req: R, res: Response, next: NextFunction) => {
		try {
			await callback(req, res);
		} catch (error: unknown) {
			next(error);
		}
	};
};

export const controllerAsyncHandlerWithTx = <R extends Request>(
	callback: AsyncControllerWithTx<R>,
) => {
	return async (req: R, res: Response, next: NextFunction) => {
		const session = await mongoose.startSession();

		try {
			session.startTransaction();
			await callback(req, res, session);
			await session.commitTransaction();
		} catch (error: unknown) {
			if (session.inTransaction()) {
				await session.abortTransaction();
			}
			next(error);
		} finally {
			await session.endSession();
		}
	};
};
