import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Text, Box, Stack } from '@chakra-ui/react'
import getAllChildren from '../utils/getAllChildren'
import { TICKET_TYPES } from '../constants'

const TreeView = ({ allTickets, currentTicket }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [tree, setTree] = useState({})

    const sortTickets = (ticketList) => {
        return ticketList.sort((a, b) => (a._id > b._id ? 1 : -1))
    }

    useEffect(() => {
        const pathname = location.pathname.substring(1).split('/')
        const ticketType = pathname[0]
        const ticketID = parseInt(pathname[1])
        const { SF, FI, PPR, UPR } = allTickets

        if (SF.length === 0) return
        let id = ticketID
        switch (ticketType) {
            case TICKET_TYPES.FI:
                id = FI.find((ticket) => ticket._id === ticketID).sf_link
                break
            case TICKET_TYPES.PPR:
                const ppr = PPR.find((ticket) => ticket._id === ticketID)
                id = FI.find((ticket) => ticket._id === ppr.fi_link).sf_link
                break
            case TICKET_TYPES.UPR:
                const upr = UPR.find((ticket) => ticket._id === ticketID)
                id = FI.find((ticket) => ticket._id === upr.fi_link).sf_link
                break
            default:
                break
        }
        setTree(getAllChildren(id, allTickets))
    }, [location.pathname, allTickets])

    if (location.pathname === '/' || !tree || Object.keys(tree).length === 0)
        return <Text>No tree to display</Text>

    return (
        <Stack>
            <Box
                bgColor="purple.200"
                p="4px 8px"
                mr="20%"
                borderRadius="8px"
                cursor="pointer"
            >
                <Text
                    fontWeight={
                        currentTicket.code === tree.code ? '800' : '600'
                    }
                    fontSize="xs"
                    onClick={() => navigate(tree.path)}
                >
                    {`${tree.code}: ${tree.name}`}
                </Text>
            </Box>

            {sortTickets(tree.fundingItems).map((fi) => {
                return (
                    <Box key={fi.code} m="0 !important">
                        <Box
                            bgColor="blue.200"
                            m="4px 10% 0"
                            p="4px 8px"
                            borderRadius="8px"
                            cursor="pointer"
                        >
                            <Text
                                fontWeight={
                                    currentTicket.code === fi.code
                                        ? '800'
                                        : '600'
                                }
                                fontSize="xs"
                                onClick={() => navigate(`${fi.path}`)}
                            >
                                {`${fi.code}: ${fi.name}`}
                            </Text>
                        </Box>
                        {sortTickets(fi.personalPurchases).map((ppr) => {
                            return (
                                <Box
                                    key={ppr.code}
                                    bgColor="cyan.200"
                                    m="4px 0 0 20%"
                                    p="4px 8px"
                                    borderRadius="8px"
                                    cursor="pointer"
                                >
                                    <Text
                                        fontWeight={
                                            currentTicket.code === ppr.code
                                                ? '800'
                                                : '600'
                                        }
                                        fontSize="xs"
                                        onClick={() => navigate(`${ppr.path}`)}
                                    >
                                        {`${ppr.code}: ${ppr.name}`}
                                    </Text>
                                </Box>
                            )
                        })}
                        {sortTickets(fi.uwFinancePurchases).map((upr) => {
                            return (
                                <Box
                                    key={upr.code}
                                    bgColor="teal.200"
                                    m="4px 0 0 20%"
                                    p="4px 8px"
                                    borderRadius="8px"
                                    cursor="pointer"
                                >
                                    <Text
                                        fontWeight={
                                            currentTicket.code === upr.code
                                                ? '800'
                                                : '600'
                                        }
                                        fontSize="xs"
                                        onClick={() => navigate(`${upr.path}`)}
                                    >
                                        {`${upr.code}: ${upr.name}`}
                                    </Text>
                                </Box>
                            )
                        })}
                    </Box>
                )
            })}
        </Stack>
    )
}

export default TreeView
