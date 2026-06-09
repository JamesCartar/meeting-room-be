import Role from "@db/models/role.model";
import { ROLE_IDS } from "./ids.constant";

const roleSeeds = [
	{
		_id: ROLE_IDS.ADMIN,
		name: "Admin",
		description: "Full system access",
		type: "system",
	},
	{
		_id: ROLE_IDS.OWNER,
		name: "Owner",
		description:
			"Can manage bookings and view booking summaries, but cannot manage users",
		type: "system",
	},
	{
		_id: ROLE_IDS.USER,
		name: "User",
		description: "Can create bookings and delete only their own bookings",
		type: "system",
	},
];

export const seedRole = async () => {
	try {
		console.log("Seeding roles... ");

		await Role.deleteMany({});
		await Role.insertMany(roleSeeds);

		console.log("Role seeding Done.");
	} catch (error) {
		console.error("Error seeding role:", error);
		throw error;
	}
};
