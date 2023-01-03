import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Heading, Flex, VStack, Text, Center } from '@chakra-ui/react'
import axios from 'axios'

import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import TicketList from './TicketList'
import LoadingSpinner from './Spinner'

const VALID_TICKET_TYPES = Object.freeze(['SF', 'FI', 'PPR', 'UPR'])

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

    const [currentTicket, updateCurentTicket] = useReducer(
        (data, partialData) => ({
            ...data,
            ...partialData,
        }),
        {
            type: '',
            id: 0,
            data: {},
        }
    )

    const [allTickets, updateAllTickets] = useReducer(
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
            .then((responses) => {
                Object.keys(endpoints).forEach((key, index) => {
                    updateAllTickets({ [key]: responses[index].data })
                })
                console.log('fetched all tickets')
            })
    }

    useEffect(() => {
        getAllTickets()
    }, [])

    useEffect(() => {
        const splitPath = location.pathname.split('/')
        if (splitPath.length !== 3 || !VALID_TICKET_TYPES.includes(splitPath[1])) return
        const currentTicketType = splitPath[1]
        const currentTicketId = splitPath[2]
        const allTicketsWithCurrentTicketType = allTickets[DATA_KEYS[currentTicketType]]
        const currentTicketData = allTicketsWithCurrentTicketType.find(
            (ticket) => parseInt(ticket._id) === parseInt(currentTicketId)
        )
        if (!currentTicketData) return
        updateCurentTicket({
            type: currentTicketType,
            id: currentTicketId,
            data: currentTicketData,
        })
    }, [location.pathname, allTickets])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (err) {
            setError(`Failed to log out, Error: ${err}`)
        }
    }

    const getCurrentTicketContent = () => {
        if (location.pathname === '/') {
            return (
                <Center w="100%">
                    <Heading fontSize="24px">Choose a ticket to view</Heading>
                </Center>
            )
        }
        if (currentTicket.id === 0) {
            return (
                <Center w="100%">
                    <LoadingSpinner />
                </Center>
            )
        }
        return (
            <>
                <Box w="100%" p="16px 24px" justifyContent="flex-start">
                    <Heading fontSize="24px">
                        {`${currentTicket.type}-${currentTicket.id}: ${currentTicket.data?.name}`}
                    </Heading>
                    <Text>
                        {location.pathname}
                    </Text>
                    <Text>
                        {location.pathname}
                    </Text>
                    <Text>
                        {location.pathname}
                    </Text>
                </Box>
                <Box minW="300px" p="16px 24px">
                    <Text>
                        {location.pathname}
                    </Text>
                </Box>
            </>
        )
    }

    return (
        <VStack spacing="0">
            <Navbar
                onClick={handleLogout}
                authButtonText={error ? error : 'Log Out'}
            />
            <Flex w="100%">
                <TicketList
                    sfData={allTickets[DATA_KEYS.SF]}
                    fiData={allTickets[DATA_KEYS.FI]}
                    pprData={allTickets[DATA_KEYS.PPR]}
                    uprData={allTickets[DATA_KEYS.UPR]}
                />
                {getCurrentTicketContent()}
            </Flex>
        </VStack>
    )
}

export default Dashboard
