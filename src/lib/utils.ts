import type { Account } from './generated';

export const updateLoggedinUsers = (user: Account) => {
	let loggedinUsers = JSON.parse(localStorage.getItem('loggedinUsers') as string) || [];

	const updatedUser = {
		...(user.email && { email: user.email }),
		...(user.staff_profile?.first_name && { firstName: user.staff_profile?.first_name }),
		...(user.staff_profile?.last_name && { lastName: user.staff_profile?.last_name }),
		...(user.staff_profile?.profile_picture.image && {
			avatar: user.staff_profile?.profile_picture.image
		})
	};
	if (loggedinUsers.length > 0) {
		let userToUpdate = loggedinUsers.findIndex((user) => user.email === updatedUser.email);
		if (userToUpdate < 0 && userToUpdate < loggedinUsers.length) {
			console.log('Trace before updating loggedin users', loggedinUsers[userToUpdate]);
			loggedinUsers[userToUpdate] = updatedUser;
			console.log('Trace after updating loggedin users', loggedinUsers[userToUpdate]);
		}
	} else {
		loggedinUsers = [...loggedinUsers, updatedUser];
	}

	localStorage.setItem('loggedinUsers', JSON.stringify(loggedinUsers));
};
