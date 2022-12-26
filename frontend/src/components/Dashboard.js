import React, { useEffect, useReducer, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import TicketList from './TicketList'
import Navbar from './Navbar'
import { Text } from '@chakra-ui/react'

export const SF_DATA_KEY = 'sfData'
export const FI_DATA_KEY = 'fiData'
export const PPR_DATA_KEY = 'pprData'
export const UPR_DATA_KEY = 'uprData'

const Dashboard = (props) => {
    const [error, setError] = useState('')
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [tickets, updateTickets] = useReducer((data, partialData) => ({
            ...data,
            ...partialData,
        }), {
        [SF_DATA_KEY]: [],
        [FI_DATA_KEY]: [],
        [PPR_DATA_KEY]: [],
        [UPR_DATA_KEY]: []
    })

    const getAllTickets = () => {
        const endpoints = {
            [SF_DATA_KEY]: 'http://localhost:5000/sponsorshipfunds/',
            [FI_DATA_KEY]: 'http://localhost:5000/fundingitems/',
            [PPR_DATA_KEY]: 'http://localhost:5000/personalpurchases/',
            [UPR_DATA_KEY]: 'http://localhost:5000/uwfinancepurchases/'
        }
        axios.all(Object.values(endpoints).map((endpoint) => axios.get(endpoint))).then(
            (responses) => Object.keys(endpoints).forEach((key, index) => 
                {updateTickets({[key]: responses[index].data})
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
            <Navbar onClick={handleLogout} authButtonText={error ? error : 'Log Out'}/>
            <TicketList
                sfData={tickets[SF_DATA_KEY]}
                fiData={tickets[FI_DATA_KEY]}
                pprData={tickets[PPR_DATA_KEY]}
                uprData={tickets[UPR_DATA_KEY]}
            />
            <Text pos='absolute' left='308px'>{location.pathname}</Text>
        </>
    )
}

export default Dashboard
