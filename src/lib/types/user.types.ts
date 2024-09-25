export interface SetupAdminPayload {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface User {
	id: number;
	email: string;
	is_superuser: boolean;
	is_pro_user: boolean;
	is_staff: boolean;
	is_active: boolean;
	is_manager: boolean;
	date_joined: string;
	last_login: string;
	staff_profile: number;
}
