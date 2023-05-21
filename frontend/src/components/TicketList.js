import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardBody, Text, VStack } from '@chakra-ui/react'
import FilterDropdown from './FilterDropdown'
import { TICKET_TYPES } from '../pages/Dashboard'
import { useSearchParams } from 'react-router-dom'

const TicketList = (props) => {
    const navigate = useNavigate()
    const [searchParams, _] = useSearchParams()
    console.log(searchParams)
    const tickettypes = searchParams.get('tickettypes')

    const [filter, setFilter] = useState(
        tickettypes
            ? tickettypes.split(',')
            : [
                  TICKET_TYPES.SF,
                  TICKET_TYPES.FI,
                  TICKET_TYPES.PPR,
                  TICKET_TYPES.UPR,
              ]
    )

    const filteredTickets = Object.entries(props.allTickets)
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
        <Box minW={{ base: '200px', lg: '280px', xl: '300px' }}>
            <FilterDropdown filter={filter} setFilter={setFilter} />
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
                                navigate(
                                    `/${ticket.type}/${ticket.id}?tickettypes=${tickettypes}`
                                )
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
        </Box>
    )
}

export default TicketList
