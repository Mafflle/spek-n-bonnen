export interface LoginPayload {
	email: string;
	password: string;
}

export interface AuthenticationCodes {
	access: string;
	refresh: string;
}
