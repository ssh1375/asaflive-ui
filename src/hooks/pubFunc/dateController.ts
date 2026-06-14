import moment from 'moment-jalaali';

export type DateInput = string | number | Date | null | undefined;

export const toShamsi = (gregorianDate: DateInput): string => {
  if (!gregorianDate) {
    return "";
  }

  try {
    const dateObject = moment(gregorianDate);

    if (!dateObject.isValid()) {
      console.warn("⚠️ تاریخ ورودی برای تبدیل به شمسی نامعتبر است:", gregorianDate);
      return "";
    }

    return dateObject.format("jYYYY/jMM/jDD");

  } catch (error) {
    console.error("🚨 خطای غیرمنتظره در تبدیل تاریخ به شمسی:", error);
    return "";
  }
};
