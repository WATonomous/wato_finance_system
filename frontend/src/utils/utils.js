import dayjs from 'dayjs'

export const getStandardizedDate = (dateStr) => {
    const date = dayjs(dateStr)
    return date.format('YYYY-MM-DD')
}
