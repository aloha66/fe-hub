export function int(str: string) {
  return Number.parseInt(str, 10)
}

export function removeUndefind(obj: object) {
  return Object.entries(obj).reduce((acc, cur) => {
    const [key, value] = cur
    if (value)
      Reflect.set(acc, key, value)
    return acc
  }, {})
}
