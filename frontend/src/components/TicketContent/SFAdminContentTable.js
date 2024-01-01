import {
    Button,
    Center,
    Heading,
    VStack,
    Link,
    useDisclosure,
} from '@chakra-ui/react'
import React, { useState } from 'react'
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
    const [confirmationModalTitleText, setConfirmationModalTitleText] =
        useState('')
    const [confirmationModalBodyText, setConfirmationModalBodyText] =
        useState('')
    const transitionStatusButtonText = {
        ALLOCATED: 'Submit Claim',
        CLAIM_SUBMITTED: 'Confirm Reimbursement Request Submitted',
        SUBMITTED_TO_SF: 'Confirm SF Reimbursed',
    }

    const handleOpenConfirmation = () => {
        setConfirmationModalTitleText(
            transitionStatusButtonText[currentTicket.status]
        )
        if (currentTicket.status === 'ALLOCATED') {
            setConfirmationModalBodyText(
                `Are you sure you want to submit this claim? This will send an email to the Finance Coordinator and prompt them to submit a reimbursement request for ${currentTicket.codename}`
            )
        }
        if (currentTicket.status === 'CLAIM_SUBMITTED') {
            setConfirmationModalBodyText(
                `Please confirm that you have submitted a reimbursement request for ${currentTicket.codename}.`
            )
        }
        if (currentTicket.status === 'SUBMITTED_TO_SF') {
            setConfirmationModalBodyText(
                `Please confirm that the sponsorship fund for ${currentTicket.codename} has successfully reimbursed WATonomous.`
            )
        }
        onOpenConfirmation()
    }
    const handleUpdateStatus = async () => {
        const nextStatus = {
            ALLOCATED: 'CLAIM_SUBMITTED',
            CLAIM_SUBMITTED: 'SUBMITTED_TO_SF',
            SUBMITTED_TO_SF: 'REIMBURSED',
        }
        const payload = {
            status: nextStatus[currentTicket.status],
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
                            title={confirmationModalTitleText}
                            body={confirmationModalBodyText}
                            onClose={onCloseConfirmation}
                            isOpen={isConfirmationOpen}
                            onConfirm={handleUpdateStatus}
                        />
                    )}
                    {currentTicket.status !== 'REIMBURSED' && (
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={handleOpenConfirmation}
                        >
                            {transitionStatusButtonText[currentTicket.status]}
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
