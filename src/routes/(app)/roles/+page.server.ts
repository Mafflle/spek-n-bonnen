import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { check, showToast } from '$lib/utils';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { z } from 'zod';

export const load: PageServerLoad = async ({ fetch, cookies, locals }) => {
	if (check('view_group', locals.user) || check('view_permission', locals.user)) {
		throw redirect(302, "/?message=You don't have the permission to view this page&&type=info");
	}

	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/permissions/?page=1&search=group`);
	const rolesRes = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/`);
	const access = cookies.get('access');
	const refresh = cookies.get('refresh');

	if (res.ok && rolesRes.ok) {
		const permissions = await res.json();
		const roles = await rolesRes.json();
		// console.log(permissions);

		permissions.results;
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

		// showToast('Error fetching roles', 'error');
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
		.nonempty({ message: 'Permissions are required' }),
	roleId: z.number().optional()
});

export const actions: Actions = {
	create: async ({ fetch, request }) => {
		const formData = await request.formData();

		const permArray = formData.getAll('permission');

		const currRoleId = formData.get('role-id');
		const name = formData.get('name');
		const permissions = permArray.map((permId) => parseInt(permId));
		const roleId = parseInt(currRoleId);

		const dataToValidate = {
			...(name && { name }),
			...(permissions && { permissions }),
			...(roleId && { roleId })
		};
		// console.log(dataToValidate);
		try {
			const validatedData = roleSchema.parse(dataToValidate);

			if (validatedData.roleId) {
				const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/${roleId}`, {
					method: 'PUT',
					body: JSON.stringify({ name, permissions })
				});
				// console.log('editing', res);

				if (res.ok) {
					const editedRole = await res.json();
					// console.log('test', editedRole);

					return {
						role: editedRole,
						edited: true
					};
				} else if (!res.ok && res.status === 400) {
					console.log(res);

					const body = await res.json();
					console.log('create role request error', body);
					return fail(400, { message: 'Error while editing role', errors: body });
				}
			} else {
				const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/`, {
					method: 'POST',
					body: JSON.stringify(validatedData)
				});

				// console.log('create role', res);

				if (res.ok) {
					const newRole = await res.json();

					return {
						role: newRole,
						edited: false
					};
				} else {
					const body = await res.json();
					// console.log('create role request error', body);
					return fail(400, { message: 'Error while creating new role', errors: body });
				}
			}
		} catch (error) {
			const toSend = {
				message: 'Ooops something went wrong',
				errors: {} as Errors
			};
			if (error instanceof z.ZodError) {
				toSend.message = 'Validation error';
				toSend.errors = error.flatten().fieldErrors;
				console.log(toSend.errors);

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
	},

	delete: async ({ fetch, request, params }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		if (id) {
			const deleteRole = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/${id}/`, {
				method: 'delete'
			});

			if (deleteRole.ok) {
				return {
					success: true
				};
			} else if (!deleteRole.ok) {
				console.log(deleteRole);
			}
		} else return fail(400);
	}
};
