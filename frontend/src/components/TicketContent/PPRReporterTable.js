import { Button, Center, Heading, Tooltip, VStack } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { allTicketsState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS } from '../../constants'
import { getAllTickets } from '../../utils/globalSetters'

const PPRReporterTable = ({ currentTicket, supportingDocuments }) => {
    const setAllTickets = useSetRecoilState(allTicketsState)

    const transitionToPurchasedAndReceiptsSubmitted = async () => {
        const payload = {
            status: 'PURCHASED_AND_RECEIPTS_SUBMITTED',
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.PPR}/${currentTicket._id}`,
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
            <Heading size="md">Reporter View</Heading>
            <Center pb="7px">
                <Tooltip
                    hasArrow
                    label="Please upload at least one supporting document before requesting reimbursement."
                    isDisabled={supportingDocuments.length !== 0}
                >
                    <Button
                        colorScheme="blue"
                        size="sm"
                        mr="20px"
                        onClick={transitionToPurchasedAndReceiptsSubmitted}
                        disabled={supportingDocuments.length === 0}
                    >
                        Confirm Item(s) Purchased and Request Reimbursement
                    </Button>
                </Tooltip>
            </Center>
        </VStack>
    )
}

export default PPRReporterTable
