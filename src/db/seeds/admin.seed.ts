import Admin from "@db/models/admin.model";
import { hashPassword } from "@utils/password.util";
import { ADMIN_IDS, ROLE_IDS } from "./ids.constant";

const adminSeeds = [
	{
		_id: ADMIN_IDS.ADMIN_1,
		name: "zaw zaw",
		email: "zawzaw@gmail.com",
		password: "yellow123",
		role: ROLE_IDS.ADMIN,
		createdAt: new Date("2026-03-30T12:10:00.000Z"),
	},
	{
		_id: ADMIN_IDS.OWNER_1,
		name: "kyaw kyaw",
		email: "kyawkyaw@gmail.com",
		password: "yellow123",
		role: ROLE_IDS.OWNER,
		createdAt: new Date("2026-03-29T08:15:00.000Z"),
	},
	{
		_id: ADMIN_IDS.USER_1,
		name: "aung aung",
		email: "aungaung@gmail.com",
		password: "yellow123",
		role: ROLE_IDS.USER,
		createdAt: new Date("2026-03-28T16:40:00.000Z"),
	},
];

export const seedAdmin = async () => {
	try {
		console.log("Seeding admins... ");

		await Admin.deleteMany({});

		const hashedAdmins = await Promise.all(
			adminSeeds.map(async (admin) => ({
				...admin,
				password: await hashPassword(admin.password),
			})),
		);
		await Admin.insertMany(hashedAdmins);

		console.log("Admin seeding Done.");
	} catch (error) {
		console.error("Error seeding admin:", error);
		throw error;
	}
};
