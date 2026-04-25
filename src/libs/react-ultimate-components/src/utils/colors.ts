export function getThemeColor(variable: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}
