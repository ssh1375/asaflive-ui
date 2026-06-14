
import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "نام باید حداقل ۲ حرف باشد" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "نام خانوادگی باید حداقل ۲ حرف باشد" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "ایمیل را وارد کنید" }).
    optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^09\d{9}$/, {
      message: "لطفاً شماره موبایل را با فرمت صحیح (مانند 09123456789) وارد کنید",
    }),
  password: z
    .string()
    .min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" }),
});

export type UserData = z.infer<typeof userSchema>;
