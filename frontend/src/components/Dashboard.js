import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    Heading,
    Flex,
    VStack,
    Center,
    Checkbox,
    Table,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react'
import axios from 'axios'

import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import TicketList from './TicketList'
import LoadingSpinner from './LoadingSpinner'
import { getStandardizedDate } from '../utils/utils'

const VALID_TICKET_TYPES = Object.freeze(['SF', 'FI', 'PPR', 'UPR'])

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
        if (location.pathname === '/') return
        const splitPath = location.pathname.split('/')
        if (
            splitPath.length !== 3 ||
            !VALID_TICKET_TYPES.includes(splitPath[1])
        ) {
            navigate('/notfound')
            return
        }
        const currentTicketType = splitPath[1]
        const currentTicketId = splitPath[2]
        const allTicketsWithCurrentTicketType =
            allTickets[DATA_KEYS[currentTicketType]]
        const currentTicketData = allTicketsWithCurrentTicketType.find(
            (ticket) => parseInt(ticket._id) === parseInt(currentTicketId)
        )
        if (!currentTicketData) return
        updateCurentTicket({
            type: currentTicketType,
            id: currentTicketId,
            data: currentTicketData,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        const metaDataMappings = {
            'Reporter Id': currentTicket.data.reporter_id,
            'Created at': getStandardizedDate(currentTicket.data.createdAt),
            'Updated at': getStandardizedDate(currentTicket.data.updatedAt),
        }
        const purchaseRequestMappings = {
            Status: ticketData.status,
            Cost: ticketData.cost,
            'Purchase Justification': ticketData.purchase_justification,
            'Purchase URL': ticketData.purchase_url,
            'Purchase Instructions': ticketData.purchase_instructions,
            'Purchase Order Number': ticketData.po_number,
            'Requisition Number': ticketData.requisition_number,
            'Pick-up Instructions': ticketData.pickup_instruction,
            'Funding Item Link': ticketData.fi_link,
        }
        const mainContentMappings = {
            [DATA_KEYS.SF]: {
                Status: ticketData.status,
                'Funding Allocation': ticketData.funding_allocation,
                'Funding Spent': ticketData.funding_spent,
                'Proposal Id': ticketData.proposal_id,
                'Proposal URL': ticketData.proposal_url,
                'Presentation URL': ticketData.presentation_url,
                'Claim Deadline': getStandardizedDate(
                    ticketData.claim_deadline
                ),
                'Funding Item Links': ticketData.fi_links,
            },
            [DATA_KEYS.FI]: {
                'Funding Allocation': ticketData.funding_allocation,
                'Funding Spent': ticketData.funding_spent,
                'Purchase Justification': ticketData.purchase_justification,
                'Sponsorship Fund Link': ticketData.sf_link,
                'Personal Purchase Links': ticketData.ppr_links,
                'UW Finance Purchase Links': ticketData.upr_links,
            },
            [DATA_KEYS.PPR]: purchaseRequestMappings,
            [DATA_KEYS.UPR]: purchaseRequestMappings,
        }
        const purchaseRequestApprovalMappings = {
            'Finance Team Approval': ticketData.finance_team_approval,
            'Team Captain Approval': ticketData.team_captain_approval,
            'Faculty Advisor Approval': ticketData.faculty_advisor_approval,
        }
        const getKeyValTableRow = (key, val) => (
            <Tr borderTopWidth="2px" borderBottomWidth="2px">
                <Th
                    w="185px"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    p={{
                        base: '4px 4px',
                        sm: '8px 8px',
                        lg: '12px 24px',
                    }}
                >
                    {key}
                </Th>
                <Td
                    fontSize={{ base: 'sm', md: 'md' }}
                    p={{
                        base: '4px 4px',
                        sm: '8px 8px',
                        lg: '12px 24px',
                    }}
                >
                    {val}
                </Td>
            </Tr>
        )

        const isCurrentTicketPurchaseRequest =
            currentTicket.type === 'UPR' || currentTicket.type === 'PPR'
        return (
            <Flex w="100%" h="calc(100vh - 80px)" overflowY="auto">
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
                    <Table>
                        {Object.entries(
                            mainContentMappings[currentTicket.type]
                        ).map(([key, val]) => getKeyValTableRow(key, val))}
                        {isCurrentTicketPurchaseRequest &&
                            Object.entries(purchaseRequestApprovalMappings).map(
                                ([key, val]) =>
                                    getKeyValTableRow(
                                        key,
                                        <Checkbox isChecked={val} />
                                    )
                            )}
                    </Table>
                </Flex>
                <VStack w="40%" h="max-content" p="16px 24px 16px 0" gap="16px">
                    <Box w="100%">
                        <Heading mb="8px" fontSize="2xl">
                            Metadata
                        </Heading>
                        <Table>
                            {Object.entries(metaDataMappings).map(
                                ([key, val]) => getKeyValTableRow(key, val)
                            )}
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
            <Navbar
                onClick={handleLogout}
                authButtonText={error ? error : 'Log Out'}
            />
            <Flex pos="absolute" top="80px" w="100%">
                <TicketList tickets={allTickets} />
                {getCurrentTicketContent()}
            </Flex>
        </VStack>
    )
}

export default Dashboard
