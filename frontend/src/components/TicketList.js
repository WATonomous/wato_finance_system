import React, { useEffect, useState } from 'react'
import usePreserveParamsNavigate from '../hooks/usePreserveParamsNavigate'
import { Box, Card, CardBody, Center, Text, VStack } from '@chakra-ui/react'
import FilterDropdown from './FilterDropdown'
import { useSearchParams } from 'react-router-dom'
import { TICKET_TYPES } from '../constants'
import LoadingSpinner from './LoadingSpinner'

const TicketList = ({ allTickets, isLoading }) => {
    const preserveParamsNavigate = usePreserveParamsNavigate()
    const [searchParams] = useSearchParams()
    const tickettypes = searchParams.get('tickettypes')
    const [filteredTickets, setFilteredTickets] = useState([])
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

    useEffect(() => {
        const newFilteredTickets = Object.entries(allTickets)
            .map(([ticketType, collection]) => {
                return collection.map((ticket) => ({
                    type: ticketType,
                    code: ticket.code,
                    path: ticket.path,
                    name: ticket.name,
                }))
            })
            .flat()
            .filter((ticket) => filter.includes(ticket.type))
        setFilteredTickets(newFilteredTickets)
    }, [allTickets, filter])

    if (isLoading) {
        return (
            <Box minW={{ base: '200px', lg: '280px', xl: '300px' }}>
                <FilterDropdown filter={filter} setFilter={setFilter} />
                <Center
                    w="100%"
                    h="calc(100vh - 152px)"
                    border="1px solid #dedede"
                >
                    <LoadingSpinner />
                </Center>
            </Box>
        )
    }

    return (
        <Box minW={{ base: '200px', lg: '280px', xl: '300px' }}>
            <FilterDropdown filter={filter} setFilter={setFilter} />
            <VStack w="100%" h="calc(100vh - 152px)" overflowY="scroll">
                {filteredTickets.map((ticket) => {
                    return (
                        <Card
                            key={ticket.code}
                            w="100%"
                            borderTop="1px solid #dedede"
                            borderBottom="1px solid #dedede"
                            borderRadius="0"
                            mt="0 !important"
                            onClick={() => preserveParamsNavigate(ticket.path)}
                            cursor="pointer"
                        >
                            <CardBody p="8px 16px">
                                <Text>{ticket.code}</Text>
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
