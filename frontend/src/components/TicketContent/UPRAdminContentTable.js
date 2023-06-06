import { Button, Center, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import TicketContentTableRow from './TicketContentTableRow'
import { currentTicketState } from '../../state/atoms'

const UPRAdminContentTable = () => {
    const [ticket, setTicket] = useRecoilState(currentTicketState)
    console.log(ticket)
    const ticketData = ticket.data
    const changeReqNumber = (e) => {
        setTicket({
            ...ticket,
            data: {
                ...ticket.data,
                requisition_number: e.target.value,
            },
        })
    }
    const changePoNumber = (e) => {
        setTicket({
            ...ticket,
            data: {
                ...ticket.data,
                po_number: e.target.value,
            },
        })
    }
    return (
        <VStack
            border="1px solid black"
            borderRadius="8px"
            padding="8px"
            mb="30px"
        >
            <Heading>Admin View</Heading>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        value={ticketData?.requisition_number}
                        onChange={changeReqNumber}
                    />
                    <TicketContentTableRow
                        heading={'PO Number'}
                        value={ticketData?.po_number}
                        onChange={changePoNumber}
                    />
                </Tbody>
            </Table>
            {
                <Center pb="7px">
                    <Button colorScheme="blue">Transition to Purchased</Button>
                </Center>
            }
        </VStack>
    )
}

export default UPRAdminContentTable
