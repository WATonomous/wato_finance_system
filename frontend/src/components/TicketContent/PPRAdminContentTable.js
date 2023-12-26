import { Button, Center, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { allTicketsState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS } from '../../constants'
import { getAllTickets } from '../../utils/globalSetters'
import { useGetCurrentTicket } from '../../hooks/hooks'

const PPRAdminContentTable = () => {
    const currentTicket = useGetCurrentTicket()
    const setAllTickets = useSetRecoilState(allTicketsState)
    const handleUpdateStatus = async (nextStatus) => {
        const payload = {
            status: nextStatus,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.PPR}/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
    }
    const getTransitionBody = () => {
        switch (currentTicket.status) {
            case 'PURCHASED_AND_RECEIPTS_SUBMITTED':
                return getPurchasedAndReceiptsSubmittedBody()
            default:
                return (
                    <>
                        <h1>No Current Actions Available</h1>
                    </>
                )
        }
    }
    const getPurchasedAndReceiptsSubmittedBody = () => {
        return (
            <Center pb="7px">
                <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() =>
                        handleUpdateStatus('REPORTER_REIMBURSE_CONFIRMATION')
                    }
                >
                    Confirm Reporter Reimbursed
                </Button>
            </Center>
        )
    }
    return (
        <VStack
            border="1px solid black"
            borderRadius="8px"
            padding="8px"
            mb="30px"
        >
            <Heading size="md">Admin View</Heading>
            <Center pb="7px">{getTransitionBody()}</Center>
        </VStack>
    )
}

export default PPRAdminContentTable
