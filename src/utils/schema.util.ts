import { Types } from "mongoose";

export const toObjectId = (id: string) => {
	return new Types.ObjectId(id);
};

export const toObjectIdArray = (ids: string[]) => {
	return ids.map((id) => new Types.ObjectId(id));
};
