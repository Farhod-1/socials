export function numberOrUndefined(value: string | any) {
  const num = Number(value)

  return isNaN(num) ? undefined : num
}
