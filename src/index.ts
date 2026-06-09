import { createServer } from "node:http";
import { env } from "@config/env.config";

import "@db/models";

import { successResponse } from "@helpers/response.helper";
import { errorHandler } from "@middlewares/handlers/error.handler";
import { notFoundHandler } from "@middlewares/handlers/notFound.handler";
import router from "@routes/index";
import cors from "cors";
import express, { type Request, type Response } from "express";
import morgan from "morgan";

const app = express();
const server = createServer(app);

// It tells Express to parse the Cloudflare headers correctly for rateLimiter.
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.ENVIRONMENT === "development") {
	app.use(morgan("dev"));
}

app.use(
	cors({
		origin: env.TRUSTED_ORIGINS,
	}),
);

app.get("/health", (_req: Request, res: Response) => {
	const data = {
		status: "healthy",
		timestamp: new Date().toISOString(),
	};
	return successResponse(res, "Meeting Room Booking Backend is running", data);
});

app.use("/api", router);

app.use(errorHandler);
app.use(notFoundHandler);

export default server;
