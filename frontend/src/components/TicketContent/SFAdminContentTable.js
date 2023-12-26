import { Button, Center, Heading, VStack, Link } from '@chakra-ui/react'
import React from 'react'
import { useGetPreserveParamsHref } from '../../hooks/hooks'
import { useGetCurrentTicket } from '../../hooks/hooks'

const SFAdminContentTable = () => {
    const getPreserveParamsHref = useGetPreserveParamsHref()
    const currentTicket = useGetCurrentTicket()
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
