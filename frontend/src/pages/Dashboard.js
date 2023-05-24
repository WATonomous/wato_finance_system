import React, { useEffect, useReducer, useState } from 'react'
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

const Dashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {
        isOpen: isDeleteTicketOpen,
        onOpen: onOpenDeleteTicket,
        onClose: onCloseDeleteTicket,
    } = useDisclosure()
    const [isDeleteTicketDisabled, setIsDeleteTicketDisabled] = useState(false)

    const [allUsers, setAllUsers] = useState({ users: [] })
    const [currentTree, setCurrentTree] = useState({})
    const [currentTicket, updateCurrentTicket] = useReducer(
        (data, partialData) => ({
            ...data,
            ...partialData,
        }),
        {
            data: {},
            type: '',
            id: 0,
            code: '',
            codename: '',
        }
    )
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

    const updatePPRInAllTickets = (newPPR) => {
        const pprIndex = allTickets[TICKET_TYPES.PPR]
            .map((ppr) => ppr._id)
            .indexOf(newPPR._id)
        let newPPRs = allTickets[TICKET_TYPES.PPR]
        newPPRs[pprIndex] = newPPR
        updateAllTickets({ [TICKET_TYPES.PPR]: newPPRs })
    }

    const updateUPRInAllTickets = (newUPR) => {
        const uprIndex = allTickets[TICKET_TYPES.UPR]
            .map((upr) => upr._id)
            .indexOf(newUPR._id)
        let newUPRs = allTickets[TICKET_TYPES.UPR]
        newUPRs[uprIndex] = newUPR
        updateAllTickets({ [TICKET_TYPES.UPR]: newUPRs })
    }

    const getAllTickets = async () => {
        const endpoints = {
            [TICKET_TYPES.SF]: `${process.env.REACT_APP_BACKEND_URL}/sponsorshipfunds/`,
            [TICKET_TYPES.FI]: `${process.env.REACT_APP_BACKEND_URL}/fundingitems/`,
            [TICKET_TYPES.PPR]: `${process.env.REACT_APP_BACKEND_URL}/personalpurchases/`,
            [TICKET_TYPES.UPR]: `${process.env.REACT_APP_BACKEND_URL}/uwfinancepurchases/`,
        }
        const data = await axios.all(
            Object.values(endpoints).map((endpoint) => axios.get(endpoint))
        )
        data.forEach((response, index) => {
            updateAllTickets({ [Object.keys(endpoints)[index]]: response.data })
        })
        console.log('fetched all tickets')
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
        const currentTicketId = parseInt(splitPath[2])
        const allTicketsWithCurrentTicketType =
            allTickets[TICKET_TYPES[currentTicketType]]
        const currentTicketData = allTicketsWithCurrentTicketType.find(
            (ticket) => ticket._id === currentTicketId
        )
        const isAllTicketsEmpty =
            Object.keys(TICKET_TYPES)
                .map((type) => allTickets[type])
                .flat().length === 0
        if (!currentTicketData) {
            if (!isAllTicketsEmpty) {
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
        updateCurrentTicket(newCurrentTicket)
        setCurrentTree(buildTicketTree(newCurrentTicket, allTickets))
    }, [location.pathname, allTickets, navigate])

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
                        updatePPRInAllTickets={updatePPRInAllTickets}
                    />
                )
            case TICKET_TYPES.UPR:
                return (
                    <UPRContentTable
                        ticketData={ticketData}
                        updateUPRInAllTickets={updateUPRInAllTickets}
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
                        <TreeView
                            currentTicket={currentTicket}
                            currentTree={currentTree}
                        />
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

    const handleDeleteCurrentTicket = async () => {
        // TODO: add backend call to delete ticket
        // maybe implement soft-delete with mongoose plugin
        // redirect to homepage after delete
        const ticketPathSegment = TICKET_ENDPOINTS[currentTicket.type]
        try {
            setIsDeleteTicketDisabled(true)
            await axiosPreset.delete(`${ticketPathSegment}/${currentTicket.id}`)
            await getAllTickets()
            navigate('/')
            onCloseDeleteTicket()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <VStack spacing="0">
            <Navbar />
            <Flex pos="absolute" top="80px" w="100%">
                <TicketList allTickets={allTickets} />
                {getMainContent()}
            </Flex>
            {isDeleteTicketOpen && (
                <DeleteTicketAlertDialog
                    isOpen={isDeleteTicketOpen}
                    disabled={isDeleteTicketDisabled}
                    onClose={onCloseDeleteTicket}
                    onDelete={handleDeleteCurrentTicket}
                    currentTicket={currentTicket}
                    currentTree={currentTree}
                />
            )}
        </VStack>
    )
}

export default Dashboard
