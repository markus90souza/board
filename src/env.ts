import { z } from 'zod'

const clientEnvSchema = z.object({
  //NEXT_PUBLIC_API_URL: z.url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.url().optional().default('https://boardigital.vercel.app'),
})

export const clientEnv = clientEnvSchema.parse(process.env)
