import Booking from "@db/models/booking.model";
import { ADMIN_IDS } from "./ids.constant";

const ownerBookingSeeds = Array.from({ length: 10 }, (_, index) => {
	const startHour = 8 + index;
	const hour = startHour.toString().padStart(2, "0");

	return {
		user: ADMIN_IDS.OWNER_1,
		startTime: new Date(`2026-06-10T${hour}:00:00.000Z`),
		endTime: new Date(`2026-06-10T${hour}:45:00.000Z`),
	};
});

const userBookingSeeds = Array.from({ length: 10 }, (_, index) => {
	const startHour = 8 + index;
	const hour = startHour.toString().padStart(2, "0");

	return {
		user: ADMIN_IDS.USER_1,
		startTime: new Date(`2026-06-11T${hour}:00:00.000Z`),
		endTime: new Date(`2026-06-11T${hour}:45:00.000Z`),
	};
});

const bookingSeeds = [...ownerBookingSeeds, ...userBookingSeeds];

export const seedBooking = async () => {
	try {
		console.log("Seeding bookings... ");

		await Booking.deleteMany({});
		await Booking.insertMany(bookingSeeds);

		console.log("Booking seeding Done.");
	} catch (error) {
		console.error("Error seeding booking:", error);
		throw error;
	}
};
