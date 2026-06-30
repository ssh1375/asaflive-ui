import { z } from "zod";

export const SESSION_EXPIRY_OPTIONS = [
  { label: "نیم ساعت", value: 1800 },
  { label: "چهل و پنج دقیقه", value: 2700 },
  { label: "یک ساعت", value: 3600 },
  { label: "یک ساعت و نیم", value: 5400 },
  { label: "دو ساعت", value: 7200 },
] as const;

const allowedExpiry = SESSION_EXPIRY_OPTIONS.map((o) => o.value) as [
  number,
  ...number[]
];

export const sessionData = z.object({
  name: z
  .string({ message: "نام جلسه الزامی است" })
  .trim()
  .min(1, { message: "مقدار نباید خالی باشد" })
  .min(2, { message: "نام جلسه باید حداقل ۲ حرف باشد" }),


  emptyTimeout: z
    .number({ error: "مقدار باید یک عدد معتبر باشد" })
    .min(1, { message: "زمان مورد نظر نباید کمتر از 1 باشد" }),

  maxParticipants: z
    .number({ error: "مقدار باید یک عدد معتبر باشد" })
    .min(2, { message: "حداقل دو نفر" })
    .max(20, { message: "حداکثر بیست نفر" }),

  sessionExpiry: z
    .number({ error: "لطفاً یک بازه زمانی انتخاب کنید" })
    .refine((v) => allowedExpiry.includes(v), {
      message: "بازه زمانی انتخاب‌شده نامعتبر است",
    }),

});

export type SessionData = z.infer<typeof sessionData>;
