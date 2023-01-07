import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardBody, Text, VStack } from '@chakra-ui/react'
import FilterDropdown from './FilterDropdown'

const TicketList = (props) => {
    const navigate = useNavigate()

    const TICKET_TYPES = Object.freeze({
        SF: 'SF',
        FI: 'FI',
        PPR: 'PPR',
        UPR: 'UPR',
    })

    const [filter, setFilter] = useState([
        TICKET_TYPES.SF,
        TICKET_TYPES.FI,
        TICKET_TYPES.PPR,
        TICKET_TYPES.UPR,
    ])

    const filteredTickets = Object.entries(props.tickets)
        .map(([ticketType, collection]) => {
            return collection.map((ticket) => ({
                name: ticket.name,
                type: ticketType,
                id: ticket._id,
            }))
        })
        .flat()
        .filter((ticket) => filter.includes(ticket.type))

    return (
        <Box>
            <FilterDropdown filter={filter} setFilter={setFilter} />
            <VStack
                pos="absolute"
                left="0"
                w="300px"
                h="calc(100vh - 80px)"
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
                                <Text>{ticket.name}</Text>
                            </CardBody>
                        </Card>
                    )
                })}
            </VStack>
        </Box>
    )
}

export default TicketList
