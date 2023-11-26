import { goto } from '$app/navigation';
import { getCurrentUser } from '$lib/user';
import { checkForUserInDatabase, client } from '$lib/utils';

export const handleUserActions = async (next?: string) => {
	try {
		const userProfile = await getCurrentUser(next);

		if (!userProfile) {
			const isUserInDB = await checkForUserInDatabase();
			if (isUserInDB) {
				await goto('auth/login?previous=/');
			} else {
				await goto('auth/setup?previous=/');
			}
		}
	} catch (error) {
		console.error('Error in setCurrentUser:', error);
		console.error('Error in checkForUserInDatabase:', error);
	}
};
