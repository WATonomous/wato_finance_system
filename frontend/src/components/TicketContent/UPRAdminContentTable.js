import { Button, Center, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import TicketContentTableRow from './TicketContentTableRow'
import { allTicketsState, currentTicketState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS } from '../../constants'
import { getAllTickets } from '../../utils/globalSetters'

const UPRAdminContentTable = () => {
    const [currentTicket, setCurrentTicket] = useRecoilState(currentTicketState)
    const [changed, setChanged] = React.useState(false)
    const setAllTickets = useSetRecoilState(allTicketsState)
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
        await getAllTickets(setAllTickets)
        setChanged(false)
    }

    const transitionToPurchased = async () => {
        const payload = {
            status: 'ORDERED',
            po_number: currentTicket.po_number,
            requisition_number: currentTicket.requisition_number,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.UPR}/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
        setCurrentTicket({
            ...currentTicket,
            status: 'ORDERED',
        })
        setChanged(false)
    }

    const transitionToPickedUp = async () => {
        const payload = {
            status: 'PICKED_UP',
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.UPR}/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
        setCurrentTicket({
            ...currentTicket,
            status: 'PICKED_UP',
        })
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
                {currentTicket.status === 'SENT_TO_COORDINATOR' && (
                    <Button
                        colorScheme="blue"
                        size="sm"
                        mr="20px"
                        onClick={transitionToPurchased}
                        disabled={
                            !currentTicket?.po_number ||
                            !currentTicket?.requisition_number
                        }
                    >
                        Transition To Purchased
                    </Button>
                )}
                {currentTicket.status === 'ORDERED' && (
                    <Button
                        colorScheme="blue"
                        size="sm"
                        mr="20px"
                        onClick={transitionToPickedUp}
                    >
                        Transition To Picked Up
                    </Button>
                )}
                <Button
                    colorScheme="green"
                    size="sm"
                    onClick={saveFields}
                    disabled={!changed}
                >
                    Save Fields
                </Button>
            </Center>
        </VStack>
    )
}

export default UPRAdminContentTable
