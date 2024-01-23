import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { PageServerLoad } from '../$types';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const createManufacturerSchema = z.object({
    name: z
        .string({ required_error: 'Manufacturer name is required' })
        .trim()
        .min(3, { message: 'Manufacturer name should be at least 3 characters ' }),
});

type Errors = {
    name?: [string];
    server?: [string];
};

export const load: PageServerLoad = async ({ fetch, url }) => {
    const getAllManufacturers = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/manufacturers/`);

    if (getAllManufacturers.ok) {
        const manufacturers = await getAllManufacturers.json();
        return {
            manufacturers
        };
    } else if (!getAllManufacturers.ok) {
        throw redirect(302, `/auth/login?from=${url.pathname}`);
    }
};

export const actions: Actions = {
    create: async ({ fetch, request }) => {
        const formData = await request.formData();

        const id = formData.get('manufacturer-id');
        const name = formData.get('manufacturer-name');

        const dataToValidate = {
            ...(name && { name }),
        };

        try {
            const validatedData = createManufacturerSchema.parse(dataToValidate);

            if (id) {
                const editManufacturer = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/manufacturers/${id}/`, {
                    method: 'PUT',
                    body: JSON.stringify(validatedData)
                });

                if (editManufacturer.ok) {
                    const updatedManufacturer = await editManufacturer.json();
                    return {
                        manufacturer: updatedManufacturer,
                        edited: true
                    };
                } else if (editManufacturer.status === 400) {
                    const badBody = await editManufacturer.json();
                    console.log(badBody);
                } else if (editManufacturer.status == 401) {
                    throw redirect(302, `/auth/login?from=${url.pathname}`);
                } else {
                    console.log(editManufacturer);
                }
            } else {
                const createManufacturer = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/manufacturers/`, {
                    method: 'POST',
                    body: JSON.stringify(validatedData)
                });

                if (createManufacturer.ok) {
                    const newManufacturer = await createManufacturer.json();
                    return {
                        manufacturer: newManufacturer
                    };
                } else if (createManufacturer.status === 400) {
                    const badBody = await createManufacturer.json();
                    console.log(badBody);
                } else if (createManufacturer.status == 401) {
                    throw redirect(302, `/auth/login?from=${url.pathname}`);
                } else {
                    console.log(createManufacturer);
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
    delete: async ({ fetch, request }) => {
        const formData = await request.formData();

        const id = formData.get('id');
        if (id) {
            const deleteRole = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/manufacturers/${id}/`, {
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