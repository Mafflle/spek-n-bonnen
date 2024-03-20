import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { z } from 'zod';
import { GroupEnum, VAT } from '$lib/stores';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: PageServerLoad = async () => {};

const groupSchema = z.object({
	name: z
		.string({ required_error: 'Group name is required' })
		.min(3, { message: 'Group name is too short, make it longer' })
		.trim(),
	department: z
		.string({ required_error: 'Department is required' })
		.min(3, { message: 'Department is too short, make it longer' })
		.trim(),
	vat: z
		.nativeEnum(VAT, {
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					case 'invalid_type':
						return { message: "VAT value is required' " };
					case 'invalid_enum_value':
						return { message: 'VAT value is invalid' };
					default:
						return { message: 'VAT value is invalid' };
				}
			}
		})
		.optional(),
	color: z.string({ required_error: 'Color is required' }).trim(),
	traceability: z.nativeEnum(GroupEnum, {
		errorMap: (issue, _ctx) => {
			switch (issue.code) {
				case 'invalid_type':
					return { message: "Traceabilty should be either of type 'AUTO' or 'MANUAL' " };
				case 'invalid_enum_value':
					return { message: "Traceability value is invalid, should be 'AUTO' | 'MANUAL'" };
				default:
					return { message: 'Traceability value is invalid' };
			}
		}
	}),
	traceability_scenario: z
		.string({ required_error: 'Traceability scenario is required' })
		.min(3, { message: 'Traceability scenario is too short, make it longer' })
		.trim()
});
interface Errors {
	name?: [string];
	department?: [string];
	color?: [string];
	vat?: [string];
	traceability?: [string];
	traceability_scenario?: [string];
	server?: [string];
}
export const actions: Actions = {
	'manage-groups': async ({ fetch, request }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const department = formData.get('department');
		const vat = parseInt(formData.get('vat') as string);
		const color = formData.get('color');
		const traceability = formData.get('traceability');
		const traceability_scenario = formData.get('traceability_scenario');

		const dataToValidate = {
			...(name && { name }),
			...(department && { department }),
			...(vat && { vat }),
			...(color && { color }),
			...(traceability && { traceability }),
			...(traceability_scenario && { traceability_scenario })
		};
		try {
			const validatedData = groupSchema.parse(dataToValidate);
			const newGroup = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/main_groups/`, {
				method: 'post',
				body: JSON.stringify(validatedData)
			});

			if (newGroup.ok) {
				const group = await newGroup.json();
				console.log(group);

				return {
					newGroup: group
				};
			} else {
				console.log(newGroup.status);
			}
		} catch (error) {
			const toSend = { message: '', errors: {} as Errors };
			if (error instanceof z.ZodError) {
				const errors = error.flatten().fieldErrors;
				toSend.message = 'Validation error';
				toSend.errors = errors;
				console.log(errors);

				return fail(400, toSend);
			}
		}
	}
};
