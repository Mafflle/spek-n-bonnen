export interface LoginPayload {
	email: string;
	password: string;
}
export interface forgotPasswordPayload {
	email: string;
}
export interface resetPasswordPayload {
	password: string;
	confirmPassword: string;
}

export interface AuthenticationCodes {
	access: string;
	refresh: string;
}
