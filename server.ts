import { config } from "dotenv";

config();

import { connectDatabase } from "./src/config/database";
import { env } from "./src/config/env.config";
import app from "./src/index";

const PORT = env.PORT;
const MONGODB_URI = env.MONGODB_URI;

connectDatabase(MONGODB_URI)
	.then(() =>
		app.listen(PORT, async () => {
			console.log(`Server is running on port ${PORT}`);
		}),
	)
	.catch((error) => {
		console.log("Database connection error", error);
		process.exit(1);
	});
