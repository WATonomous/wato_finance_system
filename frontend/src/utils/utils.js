import dayjs from 'dayjs'

export const getStandardizedDate = (dateStr) => {
    const date = dayjs(dateStr)
    return date.format('YYYY-MM-DD')
}

export const getSFName = (organization, semester) => {
    return `${organization} ${semester}`
}
