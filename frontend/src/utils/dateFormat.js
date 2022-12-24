import dayjs from 'dayjs'

export const getFriendlyDate = (dateStr) => {
    const date = dayjs(dateStr)
    return date.format('YYYY-MM-DD')
}
