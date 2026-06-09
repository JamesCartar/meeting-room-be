export interface SuccessResponse {
	message: string;
	success: boolean;
	status: number;
	data?: object;
}

export interface ErrorResponse {
	success: boolean;
	status: number;
	message: string;
	details?: ErrorDetail[];
}

export interface ErrorDetail {
	field: string | number;
	issue: string;
}
