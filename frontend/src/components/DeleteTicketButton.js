import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Flex,
    Text,
} from '@chakra-ui/react'
import React from 'react'
import { TICKET_TYPES } from '../constants'

const DeleteTicketAlertDialog = ({
    isOpen,
    onClose,
    onDelete,
    currentTicket,
    currentTree,
}) => {
    const cancelRef = React.useRef()

    const getCascadeDeleteTicketCodenames = () => {
        if (
            currentTicket.type === TICKET_TYPES.PPR ||
            currentTicket.type === TICKET_TYPES.UPR
        ) {
            return (
                <Text m="16px 0">{`• ${currentTicket.codename}`}</Text>
            )
        }

        if (currentTicket.type === TICKET_TYPES.FI) {
            const FITree = currentTree.fundingItems.find(
                (fi) => fi._id === currentTicket.id
            )
            return (
                <Flex flexDir="column" m="16px 0">
                    <Text>{`• ${currentTicket.codename}`}</Text>
                    {FITree.personalPurchases.map((ppr) => (
                        <Text pl="24px">{`• ${ppr.codename}`}</Text>
                    ))}
                    {FITree.uwFinancePurchases.map((upr) => (
                        <Text pl="24px">{`• ${upr.codename}`}</Text>
                    ))}
                </Flex>
            )
        }

        // SF
        return (
            <Flex flexDir="column" m="16px 0">
                <Text>{`• ${currentTicket.codename}`}</Text>
                {currentTree.fundingItems.map((fi) => (
                    <>
                        <Text pl="24px">{`• ${fi.codename}`}</Text>
                        {fi.personalPurchases.map((ppr) => (
                            <Text pl="48px">{`• ${ppr.codename}`}</Text>
                        ))}
                        {fi.uwFinancePurchases.map((upr) => (
                            <Text pl="48px">{`• ${upr.codename}`}</Text>
                        ))}
                    </>
                ))}
            </Flex>
        )
    }

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Current Ticket
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Text>The following tickets will be deleted:</Text>
                        {getCascadeDeleteTicketCodenames()}
                        <Text>
                            Are you sure you want to delete these tickets?
                        </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                onClose()
                                onDelete()
                            }}
                            ml={3}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default DeleteTicketAlertDialog
