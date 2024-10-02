import { checkIfAdminExists, getCurrentUser, type Account } from '$lib/generated';
import { AxiosError } from 'axios';

const init = () => {
	const fetchCurrentUser = async () => {
		try {
			const { data } = await getCurrentUser();
			return data as Account;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 401) {
				return;
			}

			console.log(error);
		}
	};

	const checkAdminExists = async () => {
		try {
			const { data } = await checkIfAdminExists();
			return data?.admin_exists ?? false;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 401) {
				return;
			}

			console.log(error);
		}
	};

	return {
		fetchCurrentUser,
		checkAdminExists
	};
};
const user = init();

export default user;
