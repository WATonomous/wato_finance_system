import React, { useEffect, useReducer, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import TicketList from './TicketList'
import Navbar from './Navbar'
import { Text } from '@chakra-ui/react'

const DATA_KEYS = Object.freeze({
    SF: 'sfData',
    FI: 'fiData',
    PPR: 'pprData',
    UPR: 'uprData',
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
        } catch {
            setError('Log out failed, try again')
        }
    }

    return (
        <>
            <Navbar
                onClick={handleLogout}
                authButtonText={error ? error : 'Log Out'}
            />
            <TicketList
                sfData={tickets[DATA_KEYS.SF]}
                fiData={tickets[DATA_KEYS.FI]}
                pprData={tickets[DATA_KEYS.PPR]}
                uprData={tickets[DATA_KEYS.UPR]}
            />
            <Text pos="absolute" left="308px">
                {location.pathname}
            </Text>
        </>
    )
}

export default Dashboard
