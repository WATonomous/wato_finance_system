import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Text, Box } from '@chakra-ui/react'
import getAllChildren from '../utils/getAllChildren'
import { TICKET_TYPES } from '../pages/Dashboard'

const TreeView = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { tickets } = props
    const [tree, setTree] = useState({})
    const pathname = location.pathname.substring(1).split('/')
    const ticketType = pathname[0]
    const ticketID = parseInt(pathname[1])

    const sortTickets = (ticketList) => {
        let sortedArr = ticketList.sort((a, b) => (a._id > b._id ? 1 : -1))
        return sortedArr
    }

    const { SF, FI, PPR, UPR } = tickets
    useEffect(() => {
        setTree({})
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
        }
        if (id !== -1) setTree(getAllChildren(id, tickets))
    }, [tickets, location])

    if (location.pathname === '/' || Object.keys(tree).length === 0) return null

    return (
        <Box
            border="1px"
            borderColor="gray.200"
            height="auto"
            paddingY="24px"
            pl="24px"
            pr="56px"
        >
            <Box>
                <Box bgColor="tomato" cursor="pointer">
                    <Text
                        as={
                            ticketType === 'SF' && ticketID === tree._id
                                ? 'b'
                                : ''
                        }
                        fontSize="xs"
                        onClick={() => navigate(`/SF/${tree._id}`)}
                    >
                        {`${TICKET_TYPES.SF} - ${tree.name}`}
                    </Text>
                </Box>

                {sortTickets(tree.fundingItems).map((fi) => {
                    return (
                        <Box key={`${TICKET_TYPES.FI} - ${fi.name}`}>
                            <Box
                                pos="relative"
                                left="4"
                                bgColor="#34cceb"
                                cursor="pointer"
                            >
                                <Text
                                    as={
                                        ticketType === `${TICKET_TYPES.FI}` &&
                                        ticketID === fi._id
                                            ? 'b'
                                            : ''
                                    }
                                    fontSize="xs"
                                    onClick={() =>
                                        navigate(
                                            `/${TICKET_TYPES.FI}/${fi._id}`
                                        )
                                    }
                                >
                                    {`${TICKET_TYPES.FI} - ${fi.name}`}
                                </Text>
                            </Box>
                            {sortTickets(fi.personalPurchases).map((ppr) => {
                                return (
                                    <Box
                                        key={`${TICKET_TYPES.PPR} - ${ppr.name}`}
                                        pos="relative"
                                        left="8"
                                        border="1px"
                                        borderColor="gray.200"
                                        borderRadius="4"
                                        cursor="pointer"
                                        bgColor="#22f5a1"
                                    >
                                        <Text
                                            as={
                                                ticketType ===
                                                    `${TICKET_TYPES.PPR}` &&
                                                ticketID === ppr._id
                                                    ? 'b'
                                                    : ''
                                            }
                                            fontSize="xs"
                                            onClick={() =>
                                                navigate(
                                                    `/${TICKET_TYPES.PPR}/${ppr._id}`
                                                )
                                            }
                                        >
                                            {`${TICKET_TYPES.PPR} - ${ppr.name}`}
                                        </Text>
                                    </Box>
                                )
                            })}
                            {sortTickets(fi.uwFinancePurchases).map((upr) => {
                                return (
                                    <Box
                                        key={`${TICKET_TYPES.UPR} - ${upr.name}`}
                                        pos="relative"
                                        left="8"
                                        border="1px"
                                        borderColor="gray.200"
                                        borderRadius="4"
                                        cursor="pointer"
                                        bgColor="#ff87f3"
                                    >
                                        <Text
                                            as={
                                                ticketType ===
                                                    `${TICKET_TYPES.UPR}` &&
                                                ticketID === upr._id
                                                    ? 'b'
                                                    : ''
                                            }
                                            fontSize="xs"
                                            onClick={() =>
                                                navigate(
                                                    `/${TICKET_TYPES.UPR}/${upr._id}`
                                                )
                                            }
                                        >
                                            {`${TICKET_TYPES.UPR} - ${upr.name}`}
                                        </Text>
                                    </Box>
                                )
                            })}
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export default TreeView
