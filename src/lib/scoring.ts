export function getBand(nilai: number): number {
  if (nilai < 500_000) return 10;
  if (nilai < 2_000_000) return 25;
  if (nilai < 10_000_000) return 50;
  if (nilai < 50_000_000) return 80;
  if (nilai < 250_000_000) return 120;
  if (nilai < 500_000_000) return 150;
  return 200;
}
