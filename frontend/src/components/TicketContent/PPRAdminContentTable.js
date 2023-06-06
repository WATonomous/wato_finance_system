import { Button, Center, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import { currentTicketState } from '../../state/atoms'

const UPRAdminContentTable = () => {
    const [ticketData, setTicketData] = useRecoilState(currentTicketState)
    return (
        <VStack
            border="1px solid black"
            borderRadius="8px"
            padding="8px"
            mb="30px"
        >
            <Heading size="md">Admin View</Heading>
            {
                <Center pb="7px">
                    <Button
                        colorScheme="blue"
                        size="sm"
                        disabled={
                            ticketData?.po_number?.length +
                                ticketData?.requisition_number?.length ===
                            0
                        }
                    >
                        Transition Status
                    </Button>
                </Center>
            }
        </VStack>
    )
}

export default UPRAdminContentTable
