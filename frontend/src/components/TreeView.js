import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Text, Box } from '@chakra-ui/react'
import getAllChildren from '../utils/getAllChildren'

const TreeView = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { tickets } = props
    const [tree, setTree] = useState({})
    const pathname = location.pathname.substring(1).split('/')
    const ticketType = pathname[0]
    const ticketID = parseInt(pathname[1])

    const TICKET_TYPES = Object.freeze({
        SF: 'SF',
        FI: 'FI',
        PPR: 'PPR',
        UPR: 'UPR',
    })

    const sortTickets = (list) => {
        let sortedArr = list.sort((a, b) => (a.name > b.name ? 1 : -1))
        return sortedArr
    }

    let { SF, FI, PPR, UPR } = tickets
    useEffect(() => {
        setTree({})
        if (SF.length === 0) return

        let id = ticketID
        switch (ticketType) {
            case TICKET_TYPES.FI:
                id = FI.find((ticket) => ticket._id === ticketID).sf_link
                break
            case TICKET_TYPES.PPR:
                let ppr = PPR.find((ticket) => ticket._id === ticketID)
                id = FI.find((ticket) => ticket._id === ppr.fi_link).sf_link
                break
            case TICKET_TYPES.UPR:
                let upr = UPR.find((ticket) => ticket._id === ticketID)
                id = FI.find((ticket) => ticket._id === upr.fi_link).sf_link
                break
        }
        if (id !== -1) setTree(getAllChildren(id, tickets))
    }, [tickets, location])

    return (
        <Box
            pos="fixed"
            bottom="0"
            right="0"
            width="300px"
            border="1px"
            borderColor="gray.200"
            height="auto"
        >
            {location.pathname !== '/' && Object.keys(tree).length !== 0 && (
                <Box padding="24px" width="250px">
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
                            {tree.name}
                        </Text>
                    </Box>

                    {sortTickets(tree.fundingItems).map((fi, i) => {
                        return (
                            <Box key={i}>
                                <Box
                                    pos="relative"
                                    left="4"
                                    bgColor="#34cceb"
                                    cursor="pointer"
                                >
                                    <Text
                                        as={
                                            ticketType ===
                                                `${TICKET_TYPES.FI}` &&
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
                                        {fi.name}
                                    </Text>
                                </Box>
                                {sortTickets(fi.personalPurchases).map(
                                    (ppr, j) => {
                                        return (
                                            <Box
                                                key={j}
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
                                                    {ppr.name}
                                                </Text>
                                            </Box>
                                        )
                                    }
                                )}
                                {sortTickets(fi.uwFinancePurchases).map(
                                    (upr, k) => {
                                        return (
                                            <Box
                                                key={k}
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
                                                    {upr.name}
                                                </Text>
                                            </Box>
                                        )
                                    }
                                )}
                            </Box>
                        )
                    })}
                </Box>
            )}
        </Box>
    )
}

export default TreeView
