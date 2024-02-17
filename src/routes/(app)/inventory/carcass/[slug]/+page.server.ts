import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { PageServerLoad } from "../$types";
import { z } from 'zod';
import dayjs from 'dayjs';


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
    expiry_date: z.coerce
    .date({
        required_error: 'Date is required'
    })
		.transform((val) => dayjs(val).format('YYYY-MM-DD'))
})

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
    const getCarcass = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/${params.slug}`)
    const getPrimals = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`)
    const getBatches = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/`)
    if(getCarcass.ok && getPrimals.ok){
        const carcass = getCarcass.json()
        const primals = getPrimals.json()
        const batches = getBatches.json()
		const access = cookies.get('access');

        return{
            carcass,
            primals,
            batches,
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
        const expiry_date = dayjs(formData.get('expiry_date') as string).format('YYYY-MM-DD');
       

        const dataToValidate = {
            primal_id,
            carcass_id,
            ean_barcode,
            quantity,
            expiry_date
        }
        try{
            console.log("data to validate",dataToValidate)
            const validatedData = batchSchema.parse(dataToValidate)
            const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/`, {
                method: 'POST',
                body: JSON.stringify(validatedData),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.get('access')}`
                }
            });
            console.log("response 1", response)
            if(response.ok){
                console.log("response", response)
                return { status: 200 }
            }
            else{
                const errorData = await response.json(); // Extract error data from response
                console.log("error", errorData)
                return { status: 400, error: errorData } // Return error data instead of response object
            }
        }catch(error){
            console.log("error", error)
            return { status: 400, error: error.errors }
        }
     
    }
}