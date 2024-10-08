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
            case 'SEEKING_APPROVAL':
                return (
                    <>
                        <h2>
                            To transition status, all three approvals below must
                            be checked
                        </h2>
                    </>
                )
            case 'READY_TO_BUY':
                return (
                    <>
                        <h2>
                            To transition status, reporter must upload the
                            expense claim form and manually transition the
                            status
                        </h2>
                    </>
                )
            case 'PURCHASED_AND_RECEIPTS_SUBMITTED':
                return getPurchasedAndReceiptsSubmittedBody()
            case 'REPORTER_PAID':
                return (
                    <>
                        <h2>
                            To transition status, reporter must confirm they
                            have been reimbursed and manually transition the
                            status
                        </h2>
                    </>
                )
            default:
                return <h1>No Current Actions Available</h1>
        }
    }
    const getPurchasedAndReceiptsSubmittedBody = () => {
        return (
            <Center pb="7px">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUpdateStatus('REPORTER_PAID')}
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
            <Center pb="7px" flexDir="column" textAlign="center" gap="8px">
                {getTransitionBody()}
            </Center>
        </VStack>
    )
}

export default PPRAdminContentTable
