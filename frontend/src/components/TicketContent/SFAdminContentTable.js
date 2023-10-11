import { Button, Center, Heading, Link, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { currentTicketState } from '../../state/atoms'
import { usePreserveParamsNavigate } from '../../hooks/hooks'
import { useNavigate } from 'react-router-dom'

const UPRAdminContentTable = () => {
    const currentTicket = useRecoilValue(currentTicketState)
    const navigate = useNavigate()
    const preserveParamsNavigate = usePreserveParamsNavigate()
    console.log(currentTicket)
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
                    <Button
                        colorScheme="blue"
                        size="sm"
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
                        onClick={() => navigate(`/claim/${currentTicket._id}`)}
                    >
                        View Claim Page
                    </Button>
                </Center>
            }
        </VStack>
    )
}

export default UPRAdminContentTable
