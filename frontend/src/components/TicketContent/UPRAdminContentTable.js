import { Button, Center, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import TicketContentTableRow from './TicketContentTableRow'
import { allTicketsState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS } from '../../constants'
import { getAllTickets } from '../../utils/globalSetters'
import { useGetCurrentTicket } from '../../hooks/hooks'

const UPRAdminContentTable = () => {
    const location = useLocation()
    const currentTicket = useGetCurrentTicket()
    const [reqNum, setReqNum] = useState('')
    const [poNum, setPoNum] = useState('')
    const [changed, setChanged] = React.useState(false)
    const setAllTickets = useSetRecoilState(allTicketsState)
    const changeReqNumber = (e) => {
        setReqNum(e.target.value)
        setChanged(true)
    }
    const changePoNumber = (e) => {
        setPoNum(e.target.value)
        setChanged(true)
    }

    useEffect(() => {
        setReqNum(currentTicket.requisition_number ?? '')
        setPoNum(currentTicket.po_number ?? '')
    }, [
        location.pathname,
        currentTicket.requisition_number,
        currentTicket.po_number,
    ])

    const saveFields = async () => {
        const payload = {
            requisition_number: reqNum,
            po_number: poNum,
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
            po_number: poNum,
            requisition_number: reqNum,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.UPR}/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
        setChanged(false)
    }

    const transitionToReadyForPickup = async () => {
        const payload = {
            status: 'READY_FOR_PICKUP',
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.UPR}/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
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
                        value={poNum}
                        onChange={changePoNumber}
                    />
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        value={reqNum}
                        onChange={changeReqNumber}
                    />
                </Tbody>
            </Table>

            <Center pb="7px">
                {currentTicket.status === 'SENT_TO_COORDINATOR' && (
                    <Button
                        variant="secondary"
                        size="sm"
                        mr="20px"
                        onClick={transitionToPurchased}
                        disabled={!poNum || !reqNum}
                    >
                        Transition To Ordered
                    </Button>
                )}
                {currentTicket.status === 'ORDERED' && (
                    <Button
                        variant="secondary"
                        size="sm"
                        mr="20px"
                        onClick={transitionToReadyForPickup}
                    >
                        Transition To Ready for Pickup
                    </Button>
                )}
                {currentTicket.status === 'READY_FOR_PICKUP' && (
                    <Button
                        variant="secondary"
                        size="sm"
                        mr="20px"
                        onClick={transitionToPickedUp}
                    >
                        Transition To Picked Up
                    </Button>
                )}
                <Button
                    variant="greenDark"
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
