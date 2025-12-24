/**
 * 日付文字列（YYYY-MM-DD）を日本語形式（YYYY年MM月DD日）に変換する
 * @param dateStr - YYYY-MM-DD形式の日付文字列
 * @returns 日本語形式の日付文字列
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * 日付文字列を年と月日に分けて返す
 * @param dateStr - YYYY-MM-DD形式の日付文字列
 * @returns 年と月日のオブジェクト
 */
export const splitDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return {
    year: `${date.getFullYear()}`,
    monthDay: `${date.getMonth() + 1}. ${date.getDate()}`,
  }
}
