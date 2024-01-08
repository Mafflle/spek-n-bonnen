import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { uploadImage } from '$lib/api';
import type { Actions } from '@sveltejs/kit';
import { data } from 'autoprefixer';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// console.log(cookies.get('access'));
};

export const actions: Actions = {
	create: async ({ fetch, request, cookies }) => {
		// console.log(cookies.get('access'));

		const formData = await request.formData();

		const name = formData.get('brand-name');
		const logo = formData.get('brand-image');

		const dataToValidate = {
			...(name && { name }),
			...(logo && { logo })
		};

		let dataToSend = new FormData();
		if (name && logo) {
			dataToSend.append('title', name);
			dataToSend.append('image', logo);
			console.log(dataToSend.get('image'));
		}
		if (dataToSend) {
			const createLogo = await fetch(`${PUBLIC_API_ENDPOINT}api/images/images/`, {
				method: 'POST',
				body: dataToSend
			});
			// console.log(createLogo);

			if (createLogo.ok) {
				const brandLogo = await createLogo.json();
				console.log(brandLogo);
			} else console.log(createLogo.status, createLogo.statusText);
		}
	}
};
