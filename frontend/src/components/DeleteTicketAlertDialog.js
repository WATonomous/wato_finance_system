import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { TICKET_ENDPOINTS, TICKET_TYPES } from '../constants'
import { useNavigate } from 'react-router-dom'
import { axiosPreset } from '../axiosConfig'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { allTicketsState, currentTicketState, currentTreeState } from '../state/atoms'
import getAllTickets from '../utils/getAllTickets'

const DeleteTicketAlertDialog = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const currentTicket = useRecoilValue(currentTicketState)
    const currentTree = useRecoilValue(currentTreeState)
    const setAllTickets = useSetRecoilState(allTicketsState)
    const [isDisabled, setIsDisabled] = useState(false)
    const cancelRef = React.useRef()

    const handleDeleteCurrentTicket = async () => {
        try {
            setIsDisabled(true)
            await axiosPreset.delete(
                `${TICKET_ENDPOINTS[currentTicket.type]}/${currentTicket._id}`
            )
            await getAllTickets(setAllTickets)
            navigate('/')
            onClose()
        } catch (err) {
            console.log(err)
        } finally {
            setIsDisabled(false)
        }
    }

    const getCascadeDeleteTicketCodenames = () => {
        if (
            currentTicket.type === TICKET_TYPES.PPR ||
            currentTicket.type === TICKET_TYPES.UPR
        ) {
            return <Text m="16px 0">{`• ${currentTicket.codename}`}</Text>
        }

        if (currentTicket.type === TICKET_TYPES.FI) {
            const FITree = currentTree.fundingItems.find(
                (fi) => fi._id === currentTicket._id
            )
            return (
                <Flex flexDir="column" m="16px 0">
                    <Text>{`• ${currentTicket.codename}`}</Text>
                    {FITree.personalPurchases.map((ppr) => (
                        <Text
                            key={ppr.code}
                            pl="24px"
                        >{`• ${ppr.codename}`}</Text>
                    ))}
                    {FITree.uwFinancePurchases.map((upr) => (
                        <Text
                            key={upr.code}
                            pl="24px"
                        >{`• ${upr.codename}`}</Text>
                    ))}
                </Flex>
            )
        }

        // SF
        return (
            <Flex flexDir="column" m="16px 0">
                <Text>{`• ${currentTicket.codename}`}</Text>
                {currentTree.fundingItems.map((fi) => (
                    <Box key={fi.code}>
                        <Text pl="24px">{`• ${fi.codename}`}</Text>
                        {fi.personalPurchases.map((ppr) => (
                            <Text
                                key={ppr.code}
                                pl="48px"
                            >{`• ${ppr.codename}`}</Text>
                        ))}
                        {fi.uwFinancePurchases.map((upr) => (
                            <Text
                                key={upr.code}
                                pl="48px"
                            >{`• ${upr.codename}`}</Text>
                        ))}
                    </Box>
                ))}
            </Flex>
        )
    }

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            disabled={isDisabled}
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
                            onClick={handleDeleteCurrentTicket}
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
