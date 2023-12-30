import {
    Button,
    Center,
    Heading,
    VStack,
    Link,
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { useGetPreserveParamsHref } from '../../hooks/hooks'
import { useGetCurrentTicket } from '../../hooks/hooks'
import { TICKET_ENDPOINTS } from '../../constants'
import { useSetRecoilState } from 'recoil'
import { allTicketsState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { getAllTickets } from '../../utils/globalSetters'
import ConfirmationModal from '../ConfirmationModal'

const SFAdminContentTable = () => {
    const getPreserveParamsHref = useGetPreserveParamsHref()
    const currentTicket = useGetCurrentTicket()
    const setAllTickets = useSetRecoilState(allTicketsState)
    const {
        isOpen: isConfirmationOpen,
        onOpen: onOpenConfirmation,
        onClose: onCloseConfirmation,
    } = useDisclosure()

    const transitionStatusText = (status) => {
        if (status === 'ALLOCATED') {
            return 'Submit Claim'
        }
        if (status === 'CLAIM_SUBMITTED') {
            return 'Confirm Reimbursement Submission'
        }
        if (status === 'SUBMITTED_TO_SF') {
            return 'Confirm Reimbursement'
        }
        if (status === 'REIMBURSED') {
            return 'Reimbursement Confirmed'
        }
    }
    const nextStatus = (status) => {
        if (status === 'ALLOCATED') {
            return 'CLAIM_SUBMITTED'
        }
        if (status === 'CLAIM_SUBMITTED') {
            return 'SUBMITTED_TO_SF'
        }
        if (status === 'SUBMITTED_TO_SF') {
            return 'REIMBURSED'
        }
    }
    const handleUpdateStatus = async (nextStatus) => {
        const payload = {
            status: nextStatus,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.SF}/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
    }
    return (
        <VStack
            border="1px solid black"
            borderRadius="8px"
            padding="8px"
            mb="30px"
        >
            <Heading size="md">Admin View</Heading>
            {
                <Center pb="7px" gap="10px">
                    {isConfirmationOpen && (
                        <ConfirmationModal
                            onClose={onCloseConfirmation}
                            isOpen={isConfirmationOpen}
                            onConfirm={() =>
                                handleUpdateStatus(
                                    nextStatus(currentTicket.status)
                                )
                            }
                        />
                    )}
                    {currentTicket.status !== 'REIMBURSED' && (
                        <Button
                            colorScheme="blue"
                            size="sm"
                            disabled={
                                currentTicket?.po_number?.length +
                                    currentTicket?.requisition_number
                                        ?.length ===
                                0
                            }
                            onClick={() => {
                                onOpenConfirmation()
                            }}
                        >
                            {transitionStatusText(currentTicket.status)}
                        </Button>
                    )}
                    {/* can remove getPreserveParamsHref if it does not make sense to preserve params */}
                    <Link
                        href={getPreserveParamsHref(
                            `/claim/${currentTicket._id}`
                        )}
                    >
                        <Button colorScheme="green" size="sm">
                            View Claim Page
                        </Button>
                    </Link>
                </Center>
            }
        </VStack>
    )
}

export default SFAdminContentTable
