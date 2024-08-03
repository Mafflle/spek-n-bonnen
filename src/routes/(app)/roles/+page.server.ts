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
		return {
			permissions,
			roles,
			access,
			refresh
		};
	} else {
		if (!res.ok) {
			showToast('Error fetching permissions', 'error');
		}
		if (!rolesRes.ok) {
			showToast('Error fetching roles', 'error');
		}
		return {
			permissions: null,
			roles: null,
			access,
			refresh
		};
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
	manage_role: async ({ fetch, request }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const permArray = formData.getAll('permissions');
		const roleId = formData.get('roleId') ? parseInt(formData.get('roleId') as string) : null;

		const permissions = permArray.map((permId) => parseInt(permId as string));

		const dataToValidate = {
			...(name && { name }),
			...(permissions && { permissions }),
			...(roleId && { roleId })
		};

		try {
			const validatedData = roleSchema.parse(dataToValidate);

			if (roleId && roleId > 0) {
				const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/${roleId}/`, {
					method: 'PUT',
					body: JSON.stringify(validatedData)
				});

				if (res.ok) {
					const editedRole = await res.json();
					return {
						edited: true,
						role: editedRole
					};
				} else {
					const body = await res.json();
					return fail(400, { message: 'Error while editing role', errors: body });
				}
			} else {
				const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/`, {
					method: 'POST',
					body: JSON.stringify(validatedData)
				});

				if (res.ok) {
					const newRole = await res.json();
					return {
						edited: false,
						role: newRole
					};
				} else {
					const body = await res.json();
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
				return fail(400, toSend);
			}
			return fail(500, toSend);
		}
	},

	delete: async ({ fetch, request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (id) {
			const deleteRole = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/${id}/`, {
				method: 'DELETE'
			});

			if (deleteRole.ok) {
				return { success: true };
			} else {
				return fail(400, { message: 'Error while deleting role' });
			}
		} else {
			return fail(400, { message: 'Role ID is required for deletion' });
		}
	}
};
