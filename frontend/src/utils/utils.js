import dayjs from 'dayjs'

export const getStandardizedDate = (dateStr) => {
    const date = dayjs(dateStr)
    return date.format('YYYY-MM-DD')
}

export const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.round((now - date) / 1000)
    const minutes = Math.round(seconds / 60)
    const hours = Math.round(minutes / 60)
    const days = Math.round(hours / 24)
    const weeks = Math.round(days / 7)
    const months = Math.round(days / 30.44) // Average days per month
    const years = Math.round(days / 365)

    if (seconds < 60) {
        return 'Just now'
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (days < 7) {
        return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (days < 30) {
        // Approximate weeks in a month
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else if (months < 12) {
        return `${months} month${months > 1 ? 's' : ''} ago`
    } else {
        return `${years} year${years > 1 ? 's' : ''} ago`
    }
}

export const getFormattedCurrency = (currencyStr) => {
    const currencyFormatter = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    })
    return `CAD ${currencyFormatter.format(currencyStr)}`
}

// adds https protocol if the url doesnt contain it
export const addhttps = (url) => {
    if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = 'https://' + url
    }
    return url
}
