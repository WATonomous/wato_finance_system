import { Button, Center, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { currentTicketState } from '../../state/atoms'

const PPRAdminContentTable = () => {
    const currentTicket = useRecoilValue(currentTicketState)
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
                            currentTicket?.po_number?.length +
                                currentTicket?.requisition_number?.length ===
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

export default PPRAdminContentTable
