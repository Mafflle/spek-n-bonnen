import { client } from "$lib/utils";
import { z } from "zod";

export const schema = z.object({
  email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Not a valid email' })
			.trim(),
})

export const sendForgotPasswordMail = async (requestBody: {email?: string }) => {
  const res = await client.post('auth/forgot-password',  requestBody )
  return res;
}