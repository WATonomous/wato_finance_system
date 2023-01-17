import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Heading, Flex, VStack, Center, Table } from '@chakra-ui/react'
import axios from 'axios'

import Navbar from '../components/Navbar'
import TicketList from '../components/TicketList'
import LoadingSpinner from '../components/LoadingSpinner'
import { getStandardizedDate } from '../utils/utils'
import TicketContentTableRow from '../components/TicketContent/TicketContentTableRow'
import SFContentTable from '../components/TicketContent/SFContentTable'
import FIContentTable from '../components/TicketContent/FIContentTable'
import PPRContentTable from '../components/TicketContent/PPRContentTable'
import UPRContentTable from '../components/TicketContent/UPRContentTable'
import ReporterInfoTip from '../components/ReporterInfoTip'
export const TICKET_TYPES = Object.freeze({
    SF: 'SF',
    FI: 'FI',
    PPR: 'PPR',
    UPR: 'UPR',
})

const Dashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentTicket, updateCurrentTicket] = useReducer(
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

    const [allUsers, setAllUsers] = useState({ users: [] })

    const [allTickets, updateAllTickets] = useReducer(
        (data, partialData) => ({
            ...data,
            ...partialData,
        }),
        {
            [TICKET_TYPES.SF]: [],
            [TICKET_TYPES.FI]: [],
            [TICKET_TYPES.PPR]: [],
            [TICKET_TYPES.UPR]: [],
        }
    )

    const getAllTickets = () => {
        const endpoints = {
            [TICKET_TYPES.SF]: `${process.env.REACT_APP_BACKEND_URL}/sponsorshipfunds/`,
            [TICKET_TYPES.FI]: `${process.env.REACT_APP_BACKEND_URL}/fundingitems/`,
            [TICKET_TYPES.PPR]: `${process.env.REACT_APP_BACKEND_URL}/personalpurchases/`,
            [TICKET_TYPES.UPR]: `${process.env.REACT_APP_BACKEND_URL}/uwfinancepurchases/`,
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

    const getAllUsers = () => {
        const endpoint = `${process.env.REACT_APP_BACKEND_URL}/users/`
        axios.get(endpoint).then((response) => {
            setAllUsers({ users: response.data })
        })
    }

    useEffect(() => {
        getAllTickets()
        getAllUsers()
    }, [])

    useEffect(() => {
        if (location.pathname === '/') return
        const splitPath = location.pathname.split('/')
        if (
            splitPath.length !== 3 ||
            !Object.values(TICKET_TYPES).includes(splitPath[1])
        ) {
            navigate('/notfound')
            return
        }
        const currentTicketType = splitPath[1]
        const currentTicketId = splitPath[2]
        const allTicketsWithCurrentTicketType =
            allTickets[TICKET_TYPES[currentTicketType]]
        const currentTicketData = allTicketsWithCurrentTicketType.find(
            (ticket) => parseInt(ticket._id) === parseInt(currentTicketId)
        )
        if (!currentTicketData) return
        updateCurrentTicket({
            type: currentTicketType,
            id: currentTicketId,
            data: currentTicketData,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, allTickets])

    const getCurrentTicketContentTable = () => {
        const ticketData = currentTicket.data
        switch (currentTicket.type) {
            case TICKET_TYPES.SF:
                return <SFContentTable ticketData={ticketData} />
            case TICKET_TYPES.FI:
                return <FIContentTable ticketData={ticketData} />
            case TICKET_TYPES.PPR:
                return <PPRContentTable ticketData={ticketData} />
            case TICKET_TYPES.UPR:
                return <UPRContentTable ticketData={ticketData} />
            default:
                return null
        }
    }

    const getMainContent = () => {
        if (location.pathname === '/') {
            return (
                <Center w="100%">
                    <Heading fontSize="2xl">Choose a ticket to view</Heading>
                </Center>
            )
        }
        const ticketData = currentTicket.data
        if (!currentTicket.id || !ticketData) {
            return (
                <Center w="100%">
                    <LoadingSpinner />
                </Center>
            )
        }

        return (
            <Flex
                w="100%"
                h="calc(100vh - 80px)"
                overflowY="auto"
                // zIndex="tooltip"
            >
                <Flex
                    flexDir="column"
                    justifyContent="flex-start"
                    h="max-content"
                    w="60%"
                    p="16px 24px"
                >
                    <Heading mb="16px" fontSize="3xl">
                        {`${currentTicket.type}-${currentTicket.id}: ${ticketData.name}`}
                    </Heading>
                    {getCurrentTicketContentTable()}
                </Flex>
                <VStack w="40%" h="max-content" p="16px 24px 16px 0" gap="16px">
                    <Box w="100%">
                        <Heading mb="8px" fontSize="2xl">
                            Metadata
                        </Heading>
                        <Table>
                            <ReporterInfoTip
                                ticketData={ticketData}
                                heading={'Reporter Id'}
                                reporter={allUsers.users.find(
                                    (user) =>
                                        user.uid === ticketData.reporter_id
                                )}
                            />
                            <TicketContentTableRow
                                heading={'Created at'}
                                description={getStandardizedDate(
                                    ticketData.createdAt
                                )}
                            />
                            <TicketContentTableRow
                                heading={'Updated at'}
                                description={getStandardizedDate(
                                    ticketData.updatedAt
                                )}
                            />
                        </Table>
                    </Box>
                    <Box w="100%">
                        <Heading mb="8px" fontSize="2xl">
                            Ticket Tree
                        </Heading>
                    </Box>
                </VStack>
            </Flex>
        )
    }

    return (
        <VStack spacing="0">
            <Flex pos="absolute" top="80px" w="100%">
                <TicketList allTickets={allTickets} />
                {getMainContent()}
            </Flex>
            <Navbar />
        </VStack>
    )
}

export default Dashboard
