export const createErrorMessage = (err) => {
    const res = {
        title: '',
        description: "",
        duration: 6000,
        status: "error",
        isClosable: true,
        position: 'top-left',
    }

    //custom error messages made in frontend
    if (err.customMsg) {
        res.description = err.customMsg
        return res
    }

    const error = err.response ? err.response : err
    const data = error.data? error.data : error
    console.log(error.status)

    //MongoDB validation errors (wrong type of/missing input)
    if (data.includes("ValidationError")) {
        res.title = "Invalid Form!"
        res.description = "Please make sure all inputs are valid"
        return res
    }

    //Permission errors
    if (error.status === 403)
    {
        const words = data.split(" ")
        words.shift()
        const message = words.join(" ")
        res.title = "Permission Error!"
        res.description = message
        return res
    }

    //MongoDB errors
    if (error.status === 500)
    {
        res.title = "Internal Error!"
        res.description = "Failed to create ticket, please try again"
        return res
    }

    //possible status: 500, 403, 401
    //rest of errors
    res.title = "Error!"
    res.description = data

    return res
}

