export function convertKbToMb(sizeInKb: number): number {
  return Number(Number(Math.round((sizeInKb / 1024) * 100) / 10000).toFixed(2));
}