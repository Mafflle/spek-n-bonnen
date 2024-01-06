import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ fetch, request }) => {
		const formData = await request.formData();

		const name = formData.get('brand-name');
		const logo = formData.get('brand-image');

		const dataToValidate = {
			...(name && { name }),
			...(logo && { logo })
		};

		console.log(dataToValidate);
	}
};
