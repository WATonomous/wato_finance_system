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
