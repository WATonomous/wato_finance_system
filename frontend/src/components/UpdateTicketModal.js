import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { axiosPreset } from '../axiosConfig'
import {
    FundingItemForm,
    PersonalPurchaseForm,
    SponsorshipFundForm,
    UWFinancePurchaseForm,
} from './TicketForms'
import { TICKET_ENDPOINTS, TICKET_TYPES } from '../constants'
import { useRecoilValue } from 'recoil'
import { currentTicketState } from '../state/atoms'

export function UpdateTicketModal({ isOpen, onClose, getAllTickets }) {
    const currentTicket = useRecoilValue(currentTicketState)
    const { control, register, handleSubmit, formState } = useForm({
        defaultValues: {
            ...currentTicket,
            claim_deadline: new Date(currentTicket.claim_deadline),
        },
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        setIsDisabled(!formState.isDirty)
    }, [formState])

    const displayTicketType = () => {
        switch (currentTicket.type) {
            case TICKET_TYPES.SF:
                return (
                    <SponsorshipFundForm
                        register={register}
                        control={control}
                    />
                )
            case TICKET_TYPES.FI:
                return <FundingItemForm register={register} />
            case TICKET_TYPES.PPR:
                return <PersonalPurchaseForm register={register} />
            case TICKET_TYPES.UPR:
                return <UWFinancePurchaseForm register={register} />
            default:
                return null
        }
    }

    const updateTicket = async (formValues) => {
        if (!formState.isDirty) return
        try {
            setIsLoading(true)
            const payload = Object.keys(formValues)
                .filter((key) =>
                    Object.keys(formState.dirtyFields).includes(key)
                )
                .reduce((cur, key) => {
                    return Object.assign(cur, { [key]: formValues[key] })
                }, {})
            await axiosPreset.patch(
                `${TICKET_ENDPOINTS[currentTicket.type]}/${currentTicket._id}`,
                payload
            )
            await getAllTickets()
            onClose()
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            onCancel={onClose}
            size="lg"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{displayTicketType()}</ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        isDisabled={isDisabled}
                        isLoading={isLoading}
                        colorScheme="blue"
                        onClick={handleSubmit(updateTicket)}
                    >
                        Update Ticket
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
