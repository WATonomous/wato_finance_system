import { Button, Center, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import TicketContentTableRow from './TicketContentTableRow'
import { currentTicketState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS } from '../../constants'

const UPRAdminContentTable = ({ partialUpdateAllTickets }) => {
    const [currentTicket, setCurrentTicket] = useRecoilState(currentTicketState)
    const [changed, setChanged] = React.useState(false)
    const changeReqNumber = (e) => {
        setCurrentTicket({
            ...currentTicket,
            requisition_number: e.target.value,
        })
        setChanged(true)
    }
    const changePoNumber = (e) => {
        setCurrentTicket({
            ...currentTicket,
            po_number: e.target.value,
        })
        setChanged(true)
    }

    const saveFields = async () => {
        const payload = {
            requisition_number: currentTicket.requisition_number,
            po_number: currentTicket.po_number,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.UPR}/${currentTicket._id}`,
            payload
        )
        partialUpdateAllTickets(currentTicket.type, currentTicket._id, payload)
        setChanged(false)
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
                        value={currentTicket?.po_number}
                        onChange={changePoNumber}
                    />
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        value={currentTicket?.requisition_number}
                        onChange={changeReqNumber}
                    />
                </Tbody>
            </Table>

            <Center pb="7px">
                <Button
                    colorScheme="blue"
                    size="sm"
                    mr="20px"
                    disabled={
                        currentTicket?.po_number?.length +
                            currentTicket?.requisition_number?.length ===
                        0
                    }
                >
                    Transition Status
                </Button>

                <Button
                    colorScheme="green"
                    size="sm"
                    disabled={!changed}
                    onClick={saveFields}
                >
                    Save Fields
                </Button>
            </Center>
        </VStack>
    )
}

export default UPRAdminContentTable
