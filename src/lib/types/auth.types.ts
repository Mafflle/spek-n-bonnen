export interface LoginPayload {
	email: string;
	password: string;
}
export interface forgotPasswordPayload {
	email: string;
}

export interface AuthenticationCodes {
	access: string;
	refresh: string;
}
