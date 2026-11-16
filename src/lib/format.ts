export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-VE", { style: "currency", currency }).format(amount);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-VE", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));
}
