// Para matematiği — kayan nokta hatasını önlemek için tüm çarpım/toplam
// işlemleri santim (integer) üzerinden yapılır; gösterim için yuvarlanır.

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return Math.round(cents) / 100;
}

export function lineTotalCents(unitPrice: number, quantity: number): number {
  return toCents(unitPrice) * quantity;
}
