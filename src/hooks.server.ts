import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const handleFetch = async ({ request, fetch, event }) => {
	//Intercepts all fetch request made using the native fetch web api

	request.headers.set('Content-type', 'application/json');
		const access = event.cookies.get('access');
// console.log('handleFetch');

	request.headers.set('Authorization', `Bearer ${access}`);


	// console.log('hey');
	
	
	return fetch(request);
};

export const handle = async ({ event, resolve}) => {
	const access: string | undefined= event.cookies.get('access');
	const refresh: string | undefined = event.cookies.get('refresh');
	const getCurrentUser = async (token: string | undefined ) => {
			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
				headers: {
						Accept: "application/json",
				"Content-Type": "application/json",
					'Authorization': `Bearer ${token}`
				}
			})
			// console.log(res);
			
			if (res.ok) {
				const currentUser = await res.json()
				event.locals.user = currentUser
				// console.log(event.locals);
				
			}
		}
	if (access) {
		const checkToken = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/verify/`, {
			method: 'POST',
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			}, body: JSON.stringify({token: access})
		})
		
		// console.log(checkToken);
		
		
		
		if (checkToken.ok && checkToken.status === 200) {
			// console.log('token valid');
			
			getCurrentUser(access)
			
		} else if (!checkToken.ok && checkToken.status === 401) {
		// console.log(refresh);
		
			const refreshTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, { method: 'POST', body: JSON.stringify({ refresh: refresh }), headers: {
					Accept: "application/json",
				"Content-Type": "application/json",
			} })
			// console.log('refresh',refreshTokens);
			
			if (refreshTokens.ok) {
				const tokens = await refreshTokens.json()
					event.cookies.set('access', tokens.access, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/',
				})
				event.cookies.set('refresh', tokens.refresh, {
						httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/',
				})
				const newAccessToken: string | undefined = event.cookies.get('access');

				getCurrentUser(newAccessToken)

			} else {
				event.locals.user = null
			}
		}
	}
	
	return resolve(event);
};
