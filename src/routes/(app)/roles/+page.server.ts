import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { client, showToast } from '$lib/utils';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { z } from 'zod';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/permissions/?page=1`);
	const rolesRes = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/`);
	const access = cookies.get('access');
	const refresh = cookies.get('refresh');

	if (res.ok && rolesRes.ok) {
		const permissions = await res.json();
		const roles = await rolesRes.json();

		permissions.results = permissions.results.map((perm) => {
			return {
				value: perm.id,
				label: perm.codename
			};
		});

		return {
			permissions,
			roles,
			access,
			refresh
		};
	} else if (!res.ok) {
		console.log('permissions', res);

		showToast('Error fetching permissions', 'error');
	} else if (!rolesRes.ok) {
		console.log('roles', rolesRes);

		showToast('Error fetching roles', 'error');
	}
};

type Errors = {
	name?: [string];
	permissions?: [string];
};

const roleSchema = z.object({
	name: z
		.string({ required_error: 'Role name is required' })
		.min(2, { message: 'Role name should be longer' })
		.trim(),
	permissions: z
		.array(z.number({ required_error: 'Permission is required' }))
		.nonempty({ message: 'Permissions are required' })
});

export const actions: Actions = {
	create: async ({ fetch, request }) => {
		const formData = await request.formData();

		const permArray = formData.getAll('permission');
		const name = formData.get('name');
		const permissions = permArray.map((permId) => parseInt(permId));

		const dataToValidate = {
			...(name && { name }),
			...(permissions && { permissions })
		};
		try {
			const validatedData = roleSchema.parse(dataToValidate);

			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

			if (res.ok) {
				const newRole = await res.json();

				return {
					newRole
				};
			}
		} catch (error) {
			const toSend = {
				message: 'Ooops something went wrong',
				errors: {} as Errors
			};
			if (error instanceof z.ZodError) {
				toSend.message = 'Validation error';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
	}
};
