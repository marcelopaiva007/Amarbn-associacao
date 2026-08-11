export const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });
export function initials(name: string) { return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
