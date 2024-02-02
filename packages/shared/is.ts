export const isNumber = (value: unknown): value is number => typeof value === 'number' && !Number.isNaN(value)
export const isString = (value: unknown): value is string => typeof value === 'string'
export const inBrowser = typeof window !== 'undefined'
