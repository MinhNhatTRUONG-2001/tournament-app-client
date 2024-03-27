const date = new Date()
export const deviceTimezone = date.getTimezoneOffset() / -60 > 0 ? '+' + date.getTimezoneOffset() / -60 : date.getTimezoneOffset() / -60