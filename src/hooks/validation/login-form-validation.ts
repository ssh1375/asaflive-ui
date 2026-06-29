// hooks/validation/auth-validation.ts
import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^09\d{9}$/, {
      message: "شماره موبایل را با فرمت صحیح (مانند 09123456789) وارد کنید",
    }),
  password: z
    .string()
    .min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" }),
});

export const registerSchema = loginSchema.extend({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "نام باید حداقل ۲ حرف باشد" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "نام خانوادگی باید حداقل ۲ حرف باشد" }),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
