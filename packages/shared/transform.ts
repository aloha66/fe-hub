export function int(str: string) {
  return Number.parseInt(str, 10)
}

export function removeUndefined(obj: object) {
  return Object.entries(obj).reduce((acc, cur) => {
    const [key, value] = cur
    if (value)
      Reflect.set(acc, key, value)
    return acc
  }, {})
}

export function fixDateFormatForSafari(str: string) {
  // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
  return str.replace(/-/g, '/')
}
