export const calculatePrice = (days: number) => {
  let result = 0;
  let remainingDays = days;

  // first 4 days
  result += remainingDays >= 4 ? 1000 * 4 : (remainingDays % 4) * 1000;
  remainingDays -= 4;

  if (remainingDays <= 0) return result;
  // 5 - 9 days
  result += remainingDays >= 5 ? Math.floor((1000 * 95 / 100)) * 5 : (remainingDays % 5) * Math.floor((1000 * 95 / 100));
  remainingDays -= 5;

  if (remainingDays <= 0) return result;

  // 10 - 17 days
  result += remainingDays >= 8 ? Math.floor((1000 * 90 / 100)) * 8 : (remainingDays % 8) * Math.floor((1000 * 90 / 100));
  remainingDays -= 8;

  if (remainingDays <= 0) return result;

  // 18 - 29
  result += remainingDays * Math.floor((1000 * 85 / 100));
  return result;
}
