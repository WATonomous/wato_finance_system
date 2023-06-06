import { Button, Center, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import TicketContentTableRow from './TicketContentTableRow'
import { currentTicketState } from '../../state/atoms'

const UPRAdminContentTable = () => {
    const [ticketData, setTicketData] = useRecoilState(currentTicketState)
    const changeReqNumber = (e) => {
        setTicketData({
            ...ticketData,
            requisition_number: e.target.value,
        })
    }
    const changePoNumber = (e) => {
        setTicketData({
            ...ticketData,
            po_number: e.target.value,
        })
    }
    return (
        <VStack
            border="1px solid black"
            borderRadius="8px"
            padding="8px"
            mb="30px"
        >
            <Heading size="md">Admin View</Heading>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Purchase Order Number'}
                        value={ticketData?.po_number}
                        onChange={changePoNumber}
                    />
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        value={ticketData?.requisition_number}
                        onChange={changeReqNumber}
                    />
                </Tbody>
            </Table>
            {
                <Center pb="7px">
                    <Button
                        colorScheme="blue"
                        size="sm"
                        disabled={
                            ticketData?.po_number?.length +
                                ticketData?.requisition_number?.length ===
                            0
                        }
                    >
                        Transition Status
                    </Button>
                </Center>
            }
        </VStack>
    )
}

export default UPRAdminContentTable
