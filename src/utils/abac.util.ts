import { UnauthenticatedError } from "@helpers/errors";

export type ActorRole = "admin" | "owner" | "user";

export type Actor = {
	id: string;
	role: ActorRole;
};

export type AccessAction =
	| "user:create"
	| "user:read"
	| "user:update-role"
	| "user:delete"
	| "booking:create"
	| "booking:read"
	| "booking:delete"
	| "booking:summary";

type AccessResource = {
	user?: string;
};

export const normalizeRoleName = (roleName: string): ActorRole => {
	const normalized = roleName.trim().toLowerCase();

	if (normalized.includes("admin")) return "admin";
	if (normalized === "owner") return "owner";

	return "user";
};

export const canAccess = (
	actor: Actor,
	action: AccessAction,
	resource: AccessResource = {},
) => {
	switch (action) {
		case "user:create":
		case "user:update-role":
		case "user:delete":
			return actor.role === "admin";
		case "user:read":
			return actor.role === "admin" || actor.role === "owner";
		case "booking:create":
		case "booking:read":
			return ["admin", "owner", "user"].includes(actor.role);
		case "booking:summary":
			return actor.role === "admin" || actor.role === "owner";
		case "booking:delete":
			return (
				actor.role === "admin" ||
				actor.role === "owner" ||
				resource.user === actor.id
			);
		default:
			return false;
	}
};

export const assertCanAccess = (
	actor: Actor | undefined,
	action: AccessAction,
	resource: AccessResource = {},
) => {
	if (!actor || !canAccess(actor, action, resource)) {
		throw new UnauthenticatedError(
			"Not authorized to perform this action",
			803,
			403,
		);
	}
};
