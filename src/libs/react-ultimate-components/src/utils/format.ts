/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import "moment/dist/locale/pt-br";

export type Currency =
  | "BRL"
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD"
  | "CHF"
  | "CNY"
  | "SEK"
  | "NZD"
  | "MXN"
  | "SGD"
  | "HKD"
  | "NOK"
  | "KRW"
  | "TRY"
  | "RUB"
  | "INR"
  | "ZAR"
  | "PLN"
  | "PHP"
  | "IDR"
  | "THB"
  | "VND"
  | "MYR"
  | "CZK"
  | "HUF"
  | "DKK"
  | "ILS"
  | "CLP"
  | "COP"
  | "PEN"
  | "ARS"
  | "AED"
  | "SAR"
  | "EGP"
  | "NGN"
  | "KZT"
  | "PKR"
  | "BDT"
  | "LKR"
  | "UAH"
  | "GHS"
  | "KES"
  | "TWD";

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string): string {
  return moment.utc(date).format("DD/MM/YYYY");
}

export function collapseLongString(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength).concat("...");
  } else {
    return text;
  }
}

export function formatCurrency(
  value: number,
  locale: string,
  currency: Currency
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

const normalizeData = (v: any) => {
  if (v == null) return "";
  if (typeof v === "number") return v;
  const s = String(v).trim().toLowerCase();
  const mISO = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (mISO) return new Date(+mISO[1], +mISO[2] - 1, +mISO[3]).getTime();
  const mBR = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (mBR) return new Date(+mBR[3], +mBR[2] - 1, +mBR[1]).getTime();
  return s;
};

export function compareDataType(a: any, b: any, dir: "asc" | "desc") {
  const A = normalizeData(a),
    B = normalizeData(b);
  const n =
    typeof A === "number" && typeof B === "number"
      ? A - B
      : String(A).localeCompare(String(B), "pt-BR", { numeric: true });
  return dir === "asc" ? n : -n;
}

export function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

//change this function to format date like "01 de janeiro de 2023" using BRL locale
export function formatDateLong(date: string): string {
  const inputDate = moment(date);

  if (!inputDate.isValid()) return "";
  return inputDate.locale("pt-br").format("DD [de] MMM [de] YYYY");
}
