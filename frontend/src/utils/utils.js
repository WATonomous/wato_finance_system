import dayjs from 'dayjs'

export const getStandardizedDate = (dateStr) => {
    const date = dayjs(dateStr)
    return date.format('YYYY-MM-DD')
}

const currencyFormatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
})

export const getFormattedCurrency = (currencyStr) => {
    return `CAD ${currencyFormatter.format(currencyStr)}`
}
