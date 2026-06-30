import { z } from "zod";

export const memberSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "نام فرد الزامی است"
          : "نام باید متن باشد",
    })
    .trim()
    .min(1, "نام نباید خالی باشد")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد"),

  mobile: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "شماره موبایل الزامی است"
          : "شماره موبایل باید متن باشد",
    })
    .trim()
    .min(1, "شماره موبایل نباید خالی باشد")
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),

  receiveMedia: z.boolean({
    error: (issue) =>
      issue.input === undefined ? "این گزینه را انتخاب کنید" : "مقدار نامعتبر",
  }),

  sendMedia: z.boolean({
    error: (issue) =>
      issue.input === undefined ? "این گزینه را انتخاب کنید" : "مقدار نامعتبر",
  }),
});

export type MemberForm = z.infer<typeof memberSchema>;
