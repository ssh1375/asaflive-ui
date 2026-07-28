import moment from 'moment-jalaali';

export type DateInput = string | number | Date | null | undefined;

export const toShamsi = (
  gregorianDate: DateInput,
  includeTime: boolean = false,
  includeSeconds: boolean = false
): string => {
  if (!gregorianDate) {
    return "";
  }

  try {
    const dateObject = moment(gregorianDate);
    let formatString = "jYYYY/jMM/jDD";

    if (!dateObject.isValid()) {
      console.warn("⚠️ تاریخ ورودی برای تبدیل به شمسی نامعتبر است:", gregorianDate);
      return "";
    }

    if (includeTime) {
      const timeFormat = includeSeconds ? "HH:mm:ss" : "HH:mm";
      formatString = `${timeFormat} - ${formatString}`;
    }

    return dateObject.format(formatString);

  } catch (error) {
    console.error("🚨 خطای غیرمنتظره در تبدیل تاریخ به شمسی:", error);
    return "";
  }
};
