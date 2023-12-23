export const createErrorMessage = (err) => {
    const res = {
        title: '',
        description: '',
        duration: 6000,
        status: 'error',
        isClosable: true,
        position: 'bottom-right',
    }

    //custom error messages made in frontend
    if (err.customMsg) {
        res.title = err.customTitle
        res.description = err.customMsg
        return res
    }

    const error = err.response ? err.response : err
    const data = error.data ? error.data : error

    //MongoDB validation errors (wrong type of/missing input)
    if (typeof data === 'string' && data.includes('ValidationError')) {
        res.title = 'Invalid Form!'
        res.description = 'Please make sure all inputs are valid'
        return res
    }

    //Permission errors
    if (error.status === 403) {
        const words = data.split(' ')
        words.shift()
        const message = words.join(' ')
        res.title = 'Permission Error!'
        res.description = message
        return res
    }

    //MongoDB errors
    if (error.status === 500) {
        res.title = 'Internal Error!'
        res.description = 'Failed to finish task, please try again'
        return res
    }

    //rest of errors
    res.title = 'Error!'
    res.description = typeof data === 'string' ? data : 'Please try again'

    return res
}
