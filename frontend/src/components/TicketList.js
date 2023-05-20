import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardBody, Center, Text, VStack } from '@chakra-ui/react'
import FilterDropdown from './FilterDropdown'
import { TICKET_TYPES } from '../constants'
import LoadingSpinner from './LoadingSpinner'

const TicketList = ({ allTickets }) => {
    const navigate = useNavigate()

    const [filter, setFilter] = useState([
        TICKET_TYPES.SF,
        TICKET_TYPES.FI,
        TICKET_TYPES.PPR,
        TICKET_TYPES.UPR,
    ])

    const filteredTickets = Object.entries(allTickets)
        .map(([ticketType, collection]) => {
            return collection.map((ticket) => ({
                name: ticket.name,
                type: ticketType,
                id: ticket._id,
            }))
        })
        .flat()
        .filter((ticket) => filter.includes(ticket.type))

    const isAllTicketsEmpty =
        Object.keys(TICKET_TYPES)
            .map((type) => allTickets[type])
            .flat().length === 0

    return (
        <Box minW={{ base: '200px', lg: '280px', xl: '300px' }}>
            <FilterDropdown filter={filter} setFilter={setFilter} />

            {isAllTicketsEmpty ? (
                <Center
                    w="100%"
                    h="calc(100vh - 152px)"
                    border="1px solid #dedede"
                >
                    <LoadingSpinner />
                </Center>
            ) : (
                <VStack
                    pos="relative"
                    w="100%"
                    h="calc(100vh - 152px)"
                    overflowY="scroll"
                >
                    {filteredTickets.map((ticket) => {
                        const code = `${ticket.type}-${ticket.id}`
                        return (
                            <Card
                                key={code}
                                w="100%"
                                borderTop="1px solid #dedede"
                                borderBottom="1px solid #dedede"
                                borderRadius="0"
                                mt="0 !important"
                                onClick={() =>
                                    navigate(`/${ticket.type}/${ticket.id}`)
                                }
                                cursor="pointer"
                            >
                                <CardBody p="8px 16px">
                                    <Text>{code}</Text>
                                    <Text noOfLines="1">{ticket.name}</Text>
                                </CardBody>
                            </Card>
                        )
                    })}
                </VStack>
            )}
        </Box>
    )
}

export default TicketList
