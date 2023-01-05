import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Text, VStack } from '@chakra-ui/react'

const TicketList = (props) => {
    const navigate = useNavigate()

    const allTickets = Object.entries(props.tickets)
        .map(([ticketType, collection]) => {
            return collection.map((ticket) => ({
                name: ticket.name,
                type: ticketType,
                id: ticket._id,
            }))
        })
        .flat()

    return (
        <VStack
            minW={['200px', '200px', '200px', '280px', '300px']}
            h="calc(100vh - 80px)"
            overflowY="scroll"
        >
            {allTickets.map((ticket) => {
                const code = `${ticket.type}-${ticket.id}`
                return (
                    <Card
                        key={code}
                        w="100%"
                        borderTop="1px solid #dedede"
                        borderBottom="1px solid #dedede"
                        borderRadius="0"
                        mt="0 !important"
                        onClick={() => navigate(`/${ticket.type}/${ticket.id}`)}
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
    )
}

export default TicketList
