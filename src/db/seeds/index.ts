import { config } from "dotenv";

config();

import { connectDatabase } from "@config/database";
import { env } from "@config/env.config";
import { seedAdmin } from "./admin.seed";
import { seedBooking } from "./booking.seed";
import { seedRole } from "./role.seed";

const seed = async () => {
	try {
		console.log("Starting database seeding...\n");

		await connectDatabase(env.MONGODB_URI);

		await seedRole();
		await seedAdmin();
		await seedBooking();

		console.log("\nDatabase seeding completed successfully!");
		console.log("\nDefault credentials:");
		console.log("  Admin: zawzaw@gmail.com / yellow123");
		console.log("  Owner: kyawkyaw@gmail.com / yellow123");
		console.log("  User: aungaung@gmail.com / yellow123");

		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};

seed();
