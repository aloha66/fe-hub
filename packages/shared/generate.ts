/**
 * 生成含小写字母，数字的字符串
 * @param len 字符串长度
 * @returns
 */
export function generateRandomString(len: number) {
  return Math.random().toString(36).slice(2, 2 + len)
}
