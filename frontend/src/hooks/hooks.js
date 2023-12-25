import { useNavigate } from 'react-router-dom'
import { useSearchParams, useLocation } from 'react-router-dom'
import { allTicketsState } from '../state/atoms'
import { useRecoilValue } from 'recoil'
import { TICKET_TYPES } from '../constants'
import { useCallback, useEffect, useState } from 'react'

export const usePreserveParamsNavigate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const oldSearchParams = new URLSearchParams(searchParams)
    return (path) => {
        navigate(`${path}?${oldSearchParams.toString()}`)
    }
}

export const useGetPreserveParamsHref = () => {
    const [searchParams] = useSearchParams()
    const oldSearchParams = new URLSearchParams(searchParams)
    const newSearchParams =
        oldSearchParams.toString().trim() === ''
            ? ''
            : `?${oldSearchParams.toString()}`
    return (path) => `${path}${newSearchParams}`
}

export const useGetCurrentTicket = () => {
    const location = useLocation()
    const allTickets = useRecoilValue(allTicketsState)
    const getCurrentTicket = useCallback(() => {
        const splitPath = location.pathname.split('/')
        if (splitPath.length !== 3) return null
        const ticketType = splitPath[1]
        const ticketId = parseInt(splitPath[2])
        const currentTicketData = allTickets[TICKET_TYPES[ticketType]].find(
            (ticket) => ticket._id === ticketId
        )
        return currentTicketData
    }, [allTickets, location.pathname])
    const [ticket, setTicket] = useState(getCurrentTicket())

    useEffect(() => {
        setTicket(getCurrentTicket())
    }, [allTickets, getCurrentTicket])

    return ticket
}
