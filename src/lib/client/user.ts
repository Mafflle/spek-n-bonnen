import { client } from '.';
import type { SetupAdminPayload, User } from '$lib/types/user.types';

export const setUpAdmin = async (data: SetupAdminPayload) => {
	try {
		const { confirmPassword: password2, ...rest } = data;
		const response = await client.post<User>('/auth/setup-admin/', { ...rest, password2 });
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
