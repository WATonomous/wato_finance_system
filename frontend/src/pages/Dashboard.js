import React, { useCallback, useEffect, useState } from 'react'
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
import { useAuth } from '../contexts/AuthContext'
import FIContentTable from '../components/TicketContent/FIContentTable'
import TicketContentTableRow from '../components/TicketContent/TicketContentTableRow'
import SFContentTable from '../components/TicketContent/SFContentTable'
import PPRContentTable from '../components/TicketContent/PPRContentTable'
import UPRContentTable from '../components/TicketContent/UPRContentTable'
import ReporterInfoTip from '../components/ReporterInfoTip'
import { TICKET_ENDPOINTS, TICKET_TYPES } from '../constants'
import buildTicketTree from '../utils/buildTicketTree'
import DeleteTicketAlertDialog from '../components/DeleteTicketAlertDialog'
import { axiosPreset } from '../axiosConfig'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
    allTicketsState,
    currentTicketState,
    currentTreeState,
} from '../state/atoms'
import { UpdateTicketModal } from '../components/UpdateTicketModal'

import UPRAdminContentTable from '../components/TicketContent/UPRAdminContentTable'
import SFAdminContentTable from '../components/TicketContent/SFAdminContentTable'
import PPRAdminContentTable from '../components/TicketContent/PPRAdminContentTable'
import FIAdminContentTable from '../components/TicketContent/FIAdminContentTable'
const Dashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const {
        isOpen: isDeleteTicketOpen,
        onOpen: onOpenDeleteTicket,
        onClose: onCloseDeleteTicket,
    } = useDisclosure()

    const {
        isOpen: isUpdateTicketOpen,
        onOpen: onOpenUpdateTicket,
        onClose: onCloseUpdateTicket,
    } = useDisclosure()

    const auth = useAuth()
    const [allUsers, setAllUsers] = useState({ users: [] })
    const [isCurrentTicketReporter, setIsCurrentTicketOwner] = useState(false)
    const setCurrentTree = useSetRecoilState(currentTreeState)
    const [currentTicket, setCurrentTicket] = useRecoilState(currentTicketState)
    const [allTickets, setAllTickets] = useRecoilState(allTicketsState)

    const partialUpdateAllTickets = (ticketType, ticketId, newData) => {
        const newTickets = allTickets[ticketType].slice()
        const localIndex = newTickets
            .map((ticket) => ticket._id)
            .indexOf(ticketId)
        newTickets[localIndex] = { ...newTickets[localIndex], ...newData }
        setAllTickets({ ...allTickets, [ticketType]: newTickets })
    }

    const getAllTickets = useCallback(async () => {
        setIsLoading(true)
        const data = await axiosPreset.all(
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
        axiosPreset.get(endpoint).then((response) => {
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
        const currentTicketData = allTickets[
            TICKET_TYPES[currentTicketType]
        ].find((ticket) => ticket._id === currentTicketId)

        if (!currentTicketData) {
            if (!isLoading) {
                navigate('/notfound')
            }
            return
        }
        setCurrentTicket(currentTicketData)
        setCurrentTree(buildTicketTree(currentTicketData, allTickets))
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
        const ticketData = currentTicket

        switch (currentTicket.type) {
            case TICKET_TYPES.SF:
                return (
                    <>
                        {auth.isAdmin && <SFAdminContentTable />}
                        <SFContentTable ticketData={ticketData} />
                    </>
                )
            case TICKET_TYPES.FI:
                return (
                    <>
                        {auth.isAdmin && <FIAdminContentTable />}
                        <FIContentTable ticketData={ticketData} />
                    </>
                )

            case TICKET_TYPES.PPR:
                return (
                    <>
                        {auth.isAdmin && <PPRAdminContentTable />}
                        <PPRContentTable
                            ticketData={ticketData}
                            partialUpdateAllTickets={partialUpdateAllTickets}
                        />
                    </>
                )
            case TICKET_TYPES.UPR:
                return (
                    <>
                        {auth.isAdmin && <UPRAdminContentTable />}
                        <UPRContentTable
                            ticketData={ticketData}
                            partialUpdateAllTickets={partialUpdateAllTickets}
                        />
                    </>
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
        const ticketData = currentTicket
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
                    {/* Do not display update/delete button for WATO Cash */}
                    {currentTicket.sf_link !== -1 &&
                        (isCurrentTicketReporter || auth.isDirector) && (
                            <Flex flexDir="row" mb="12px" gap="16px">
                                <Button
                                    size="sm"
                                    colorScheme="cyan"
                                    onClick={onOpenUpdateTicket}
                                >
                                    <Text>Update</Text>
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    onClick={onOpenDeleteTicket}
                                >
                                    <Text>Delete</Text>
                                </Button>
                            </Flex>
                        )}
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
                                    value={getStandardizedDate(
                                        ticketData.createdAt
                                    )}
                                />
                                <TicketContentTableRow
                                    heading={'Updated at'}
                                    value={getStandardizedDate(
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
                <TicketList isLoading={isLoading} />
                {getMainContent()}
            </Flex>
            {isDeleteTicketOpen && (
                <DeleteTicketAlertDialog
                    isOpen={isDeleteTicketOpen}
                    onClose={onCloseDeleteTicket}
                    getAllTickets={getAllTickets}
                />
            )}
            {isUpdateTicketOpen && (
                <UpdateTicketModal
                    isOpen={isUpdateTicketOpen}
                    onClose={onCloseUpdateTicket}
                    getAllTickets={getAllTickets}
                />
            )}
        </VStack>
    )
}

export default Dashboard
