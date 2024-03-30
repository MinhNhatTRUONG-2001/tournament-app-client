export const getTimezone = (date: Date) => {
    return date.getTimezoneOffset() / -60 > 0 ? '+' + date.getTimezoneOffset() / -60 : date.getTimezoneOffset() / -60
}