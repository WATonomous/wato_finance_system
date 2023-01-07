import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Text } from '@chakra-ui/react'
import axios from 'axios'

import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import TicketList from './TicketList'

const DATA_KEYS = Object.freeze({
    SF: 'SF',
    FI: 'FI',
    PPR: 'PPR',
    UPR: 'UPR',
})

const Dashboard = (props) => {
    const [error, setError] = useState('')
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [tickets, updateTickets] = useReducer(
        (data, partialData) => ({
            ...data,
            ...partialData,
        }),
        {
            [DATA_KEYS.SF]: [],
            [DATA_KEYS.FI]: [],
            [DATA_KEYS.PPR]: [],
            [DATA_KEYS.UPR]: [],
        }
    )

    const getAllTickets = () => {
        const endpoints = {
            [DATA_KEYS.SF]: 'http://localhost:5000/sponsorshipfunds/',
            [DATA_KEYS.FI]: 'http://localhost:5000/fundingitems/',
            [DATA_KEYS.PPR]: 'http://localhost:5000/personalpurchases/',
            [DATA_KEYS.UPR]: 'http://localhost:5000/uwfinancepurchases/',
        }
        axios
            .all(
                Object.values(endpoints).map((endpoint) => axios.get(endpoint))
            )
            .then((responses) =>
                Object.keys(endpoints).forEach((key, index) => {
                    updateTickets({ [key]: responses[index].data })
                })
            )
    }

    useEffect(() => {
        getAllTickets()
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (err) {
            setError(`Failed to log out, Error: ${err}`)
        }
    }

    return (
        <>
            <Navbar
                onClick={handleLogout}
                authButtonText={error ? error : 'Log Out'}
            />
            <Text pos="absolute" left="308px">
                {location.pathname}
            </Text>
            <TicketList tickets={tickets} />
        </>
    )
}

export default Dashboard
