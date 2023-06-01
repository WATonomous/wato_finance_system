import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    Heading,
    Flex,
    VStack,
    Center,
    Table,
    Tbody,
    Button,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import TreeView from '../components/TreeView'
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
import { TICKET_ENDPOINTS, TICKET_TYPES } from '../constants'
import buildTicketTree from '../utils/buildTicketTree'
import DeleteTicketAlertDialog from '../components/DeleteTicketButton'
import { axiosPreset } from '../axiosConfig'
import { useRecoilState } from 'recoil'
import {
    allTicketsState,
    currentTicketState,
    currentTreeState,
} from '../state/atoms'
import { useAuth } from '../contexts/AuthContext'
import app from '../firebase'

const Dashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const {
        isOpen: isDeleteTicketOpen,
        onOpen: onOpenDeleteTicket,
        onClose: onCloseDeleteTicket,
    } = useDisclosure()

    const auth = useAuth(app)
    const [allUsers, setAllUsers] = useState({ users: [] })
    const [currentTree, setCurrentTree] = useRecoilState(currentTreeState)
    const [currentTicket, setCurrentTicket] = useRecoilState(currentTicketState)
    const [allTickets, setAllTickets] = useRecoilState(allTicketsState)

    const partialUpdateAllTickets = (ticketType, ticketId, newData) => {
        const localIndex = allTickets[ticketType]
            .map((ticket) => ticket._id)
            .indexOf(ticketId)
        const newTickets = allTickets[ticketType]
        newTickets[localIndex] = { ...newTickets[localIndex], ...newData }
        setAllTickets({ ...allTickets, ...{ [ticketType]: newTickets } })
    }

    const getAllTickets = useCallback(async () => {
        setIsLoading(true)
        const data = await axios.all(
            Object.values(TICKET_ENDPOINTS).map((endpoint) =>
                axiosPreset.get(endpoint)
            )
        )
        const allTickets = data.reduce((acc, response, index) => {
            return {
                ...acc,
                [Object.keys(TICKET_ENDPOINTS)[index]]: response.data,
            }
        }, {})
        setAllTickets(allTickets)
        setIsLoading(false)
    }, [setAllTickets])

    const getAllUsers = () => {
        const endpoint = `${process.env.REACT_APP_BACKEND_URL}/users/`
        axios.get(endpoint).then((response) => {
            setAllUsers({ users: response.data })
        })
    }

    useEffect(() => {
        getAllTickets()
        getAllUsers()
    }, [getAllTickets])

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
        const currentTicketId = parseInt(splitPath[2])
        const allTicketsWithCurrentTicketType =
            allTickets[TICKET_TYPES[currentTicketType]]
        const currentTicketData = allTicketsWithCurrentTicketType.find(
            (ticket) => ticket._id === currentTicketId
        )

        if (!currentTicketData) {
            if (!isLoading) {
                navigate('/notfound')
            }
            return
        }

        const newCurrentTicket = {
            data: currentTicketData,
            type: currentTicketData.type,
            id: currentTicketId,
            code: currentTicketData.code,
            codename: currentTicketData.codename,
        }
        setCurrentTicket(newCurrentTicket)
        setCurrentTree(buildTicketTree(newCurrentTicket, allTickets))
        setIsCurrentTicketOwner(
            currentTicketData.reporter_id === auth.currentUser.uid
        )
    }, [
        location.pathname,
        allTickets,
        isLoading,
        navigate,
        setCurrentTicket,
        setCurrentTree,
        auth.currentUser.uid,
    ])

    const getCurrentTicketContentTable = () => {
        const ticketData = currentTicket.data

        switch (currentTicket.type) {
            case TICKET_TYPES.SF:
                return <SFContentTable ticketData={ticketData} />
            case TICKET_TYPES.FI:
                return <FIContentTable ticketData={ticketData} />
            case TICKET_TYPES.PPR:
                return (
                    <PPRContentTable
                        ticketData={ticketData}
                        partialUpdateAllTickets={partialUpdateAllTickets}
                    />
                )
            case TICKET_TYPES.UPR:
                return (
                    <UPRContentTable
                        ticketData={ticketData}
                        partialUpdateAllTickets={partialUpdateAllTickets}
                    />
                )
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
        if (isLoading) {
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
                        {currentTicket.codename}
                    </Heading>
                    <Flex flexDir="row" mb="12px">
                        {/* Do not display delete button for WATO Cash */}
                        {currentTicket.data.sf_link !== -1 && (
                            <Button
                                size="sm"
                                colorScheme="red"
                                onClick={onOpenDeleteTicket}
                            >
                                <Text>Delete</Text>
                            </Button>
                        )}
                    </Flex>
                    {getCurrentTicketContentTable()}
                </Flex>
                <VStack w="40%" h="max-content" p="16px 24px 16px 0" gap="16px">
                    <Box w="100%">
                        <Heading mb="8px" fontSize="2xl">
                            Ticket Tree
                        </Heading>
                        <TreeView />
                    </Box>
                    <Box w="100%" mt="12px">
                        <Heading mb="8px" fontSize="2xl">
                            Metadata
                        </Heading>
                        <Table>
                            <Tbody>
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
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Flex>
        )
    }

    return (
        <VStack spacing="0">
            <Navbar getAllTickets={getAllTickets} />
            <Flex pos="absolute" top="80px" w="100%">
                <TicketList allTickets={allTickets} isLoading={isLoading} />
                {getMainContent()}
            </Flex>
            {isDeleteTicketOpen && (
                <DeleteTicketAlertDialog
                    isOpen={isDeleteTicketOpen}
                    onClose={onCloseDeleteTicket}
                    currentTicket={currentTicket}
                    currentTree={currentTree}
                    getAllTickets={getAllTickets}
                />
            )}
        </VStack>
    )
}

export default Dashboard
