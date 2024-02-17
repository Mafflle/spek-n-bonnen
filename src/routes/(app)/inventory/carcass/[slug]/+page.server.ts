import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { PageServerLoad } from "../$types";
import { z } from 'zod';


const batchSchema = z.object({
    carcass_id: z.number({
        required_error: 'carcass is required'
    }),
    primal_id: z.number({
        required_error: 'primal is required'
    }),
    ean_barcode: z.string({
        required_error: 'ean barcode is required'
    }),
    quantity: z.number({
        required_error: 'Quantity is required'
    })
    .min(-2147483648, "Quantity below minumum acceptable")
    .max(2147483647, "Quantity above maximum acceptable"),
    expiry_date: z.date({
        required_error: 'Date is required'
    })
})

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
    const getCarcass = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/${params.slug}`)
    const getPrimals = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`)
    if(getCarcass.ok && getPrimals.ok){
        const carcass = getCarcass.json()
        const primals = getPrimals.json()
		const access = cookies.get('access');

        return{
            carcass,
            primals,
            access
        }
    }
}

export const actions = {
    create: async ({ fetch, request, cookies }) => {
        const formData = await request.formData();
        const primal_id = Number(formData.get('primal_id'));
        const carcass_id = Number(formData.get('carcass_id'));
        const ean_barcode = formData.get('ean_barcode');
        const quantity = Number(formData.get('quantity'));
        const expiry_date = new Date(formData.get('expiry_date'));

        const dataToValidate = {
            primal_id,
            carcass_id,
            ean_barcode,
            quantity,
            expiry_date
        }
        try{
            const validatedData = batchSchema.parse(dataToValidate)
            const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/`, {
                method: 'POST',
                body: JSON.stringify(validatedData),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.get('access')}`
                }
            });
            if(response.ok){
                return { status: 200 }
            }
        }catch(error){
            return { status: 400, error: error.errors }
        }
     
    }
}