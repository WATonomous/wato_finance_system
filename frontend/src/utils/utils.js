import dayjs from 'dayjs'

export const getStandardizedDate = (dateStr) => {
    const date = dayjs(dateStr)
    return date.format('YYYY-MM-DD')
}

export const getFormattedCurrency = (currencyStr) => {
    const currencyFormatter = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    })
    return `CAD ${currencyFormatter.format(currencyStr)}`
}

const mimeTypeToExtension = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
}
