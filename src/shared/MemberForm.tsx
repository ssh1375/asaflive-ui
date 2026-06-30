// MemberForm.tsx
import { useState } from "react";
import { memberSchema, type MemberForm } from "../hooks/validation/member-schema";

type Errors = Record<string, string>;
const toBool = (v: string | undefined): boolean | undefined =>
  v === "yes" ? true : v === "no" ? false : undefined;

export function MemberForm({
  onSubmit,
}: {
  onSubmit: (data: MemberForm) => void;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [receiveMedia, setReceiveMedia] = useState<string>("");
  const [sendMedia, setSendMedia] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = memberSchema.safeParse({
      name,
      mobile,
      receiveMedia: toBool(receiveMedia),
      sendMedia: toBool(sendMedia),
    });

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="member-form">
      <div className="field">
        <label htmlFor="name">نام فرد</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <span id="name-error" className="error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="mobile">شماره موبایل</label>
        <input
          id="mobile"
          type="tel"
          inputMode="numeric"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          aria-invalid={!!errors.mobile}
          aria-describedby={errors.mobile ? "mobile-error" : undefined}
        />
        {errors.mobile && (
          <span id="mobile-error" className="error">
            {errors.mobile}
          </span>
        )}
      </div>

      <fieldset className="field">
        <legend>دریافت صدا و تصویر باقی اعضا</legend>
        <label>
          <input
            type="radio"
            name="receiveMedia"
            value="yes"
            checked={receiveMedia === "yes"}
            onChange={(e) => setReceiveMedia(e.target.value)}
          />
          بله
        </label>
        <label>
          <input
            type="radio"
            name="receiveMedia"
            value="no"
            checked={receiveMedia === "no"}
            onChange={(e) => setReceiveMedia(e.target.value)}
          />
          خیر
        </label>
        {errors.receiveMedia && (
          <span className="error">{errors.receiveMedia}</span>
        )}
      </fieldset>

      <fieldset className="field">
        <legend>ارسال صدا و تصویر</legend>
        <label>
          <input
            type="radio"
            name="sendMedia"
            value="yes"
            checked={sendMedia === "yes"}
            onChange={(e) => setSendMedia(e.target.value)}
          />
          بله
        </label>
        <label>
          <input
            type="radio"
            name="sendMedia"
            value="no"
            checked={sendMedia === "no"}
            onChange={(e) => setSendMedia(e.target.value)}
          />
          خیر
        </label>
        {errors.sendMedia && (
          <span className="error">{errors.sendMedia}</span>
        )}
      </fieldset>

      <button type="submit">ثبت</button>
    </form>
  );
}
