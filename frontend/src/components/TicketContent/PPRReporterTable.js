import { Button, Center, Heading, Tooltip, VStack } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { allTicketsState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS } from '../../constants'
import { getAllTickets } from '../../utils/globalSetters'

const PPRReporterTable = ({ currentTicket, supportingDocuments }) => {
    const setAllTickets = useSetRecoilState(allTicketsState)

    const transitionStatus = async (status) => {
        const payload = {
            status: status,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.PPR}/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
    }

    const getPurchasedAndRequestReimbursementBody = () => {
        return (
            <Tooltip
                hasArrow
                label="Please upload at least one supporting document before requesting reimbursement."
                isDisabled={supportingDocuments.length !== 0}
            >
                <Button
                    variant="secondary"
                    size="sm"
                    mr="20px"
                    onClick={() => {
                        transitionStatus('PURCHASED_AND_RECEIPTS_SUBMITTED')
                    }}
                    disabled={supportingDocuments.length === 0}
                >
                    Confirm Item(s) Purchased and Request Reimbursement
                </Button>
            </Tooltip>
        )
    }

    const getReimbursementConfirmationBody = () => {
        return (
            <Button
                variant="secondary"
                size="sm"
                mr="20px"
                onClick={() => {
                    transitionStatus('REPORTER_REIMBURSE_CONFIRMED')
                }}
                disabled={supportingDocuments.length === 0}
            >
                Confirm Item(s) have been Reimbursed
            </Button>
        )
    }

    const getTransitionBody = () => {
        switch (currentTicket.status) {
            case 'READY_TO_BUY':
                return getPurchasedAndRequestReimbursementBody()
            case 'REPORTER_PAID':
                return getReimbursementConfirmationBody()
            default:
                return (
                    <>
                        <h1>No Current Actions Available</h1>
                    </>
                )
        }
    }

    return (
        <VStack
            border="1px solid black"
            borderRadius="8px"
            padding="8px"
            mb="30px"
        >
            <Heading size="md">Reporter View</Heading>
            <Center pb="7px">{getTransitionBody()}</Center>
        </VStack>
    )
}

export default PPRReporterTable
