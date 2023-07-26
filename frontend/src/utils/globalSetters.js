import { TICKET_ENDPOINTS } from '../constants'
import { axiosPreset } from '../axiosConfig'

export const getAllTickets = async (setAllTickets) => {
    const responses = await Promise.all(
        Object.values(TICKET_ENDPOINTS).map((endpoint) =>
            axiosPreset.get(endpoint)
        )
    )
    setAllTickets(
        responses.reduce((acc, response, index) => {
            return {
                ...acc,
                [Object.keys(TICKET_ENDPOINTS)[index]]: response.data,
            }
        }, {})
    )
}

export const getAllFilesByCode = async (setAllFiles, code) => {
    axiosPreset
        .get(`/files/getallbyreference/${code}`)
        .then((res) => {
            setAllFiles(res.data)
            console.log(res.data)
        })
        .catch((err) => console.log(err))
}
