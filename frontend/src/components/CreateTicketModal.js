import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Select,
    FormLabel,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import app from '../firebase'
import { axiosPreset } from '../axiosConfig'
import {
    FundingItemForm,
    PersonalPurchaseForm,
    SponsorshipFundForm,
    UWFinancePurchaseForm,
} from './TicketForms'
import { TICKET_ENDPOINTS, TICKET_TYPES } from '../constants'

export function CreateTicketModal({ isOpen, onClose, getAllTickets }) {
    const [ticketType, setTicketType] = useState('')
    const { control, register, handleSubmit, reset } = useForm()
    const [isCreateTicketLoading, setIsCreateTicketLoading] = useState(false)
    const auth = useAuth(app)

    const displayTicketType = () => {
        switch (ticketType) {
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
    const createTicket = async (formValues) => {
        try {
            setIsCreateTicketLoading(true)
            const payload = {
                ...formValues,
                reporter_id: auth.currentUser.uid,
            }
            if (
                ticketType === TICKET_TYPES.UPR ||
                ticketType === TICKET_TYPES.PPR
            ) {
                payload.status = 'SEEKING_APPROVAL'
            } else if (ticketType === TICKET_TYPES.SF) {
                payload.status = 'ALLOCATED'
            }
            await axiosPreset.post(TICKET_ENDPOINTS[ticketType], payload)
            await getAllTickets()
            onClose()
        } catch (err) {
            console.log(err)
        } finally {
            setIsCreateTicketLoading(false)
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
                <ModalHeader>Create Ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormLabel>Ticket Type</FormLabel>
                    <Select
                        placeholder="Select a ticket type"
                        onChange={(e) => {
                            reset()
                            setTicketType(e.target.value)
                        }}
                        margin="10px 0"
                        size="sm"
                        isDisabled={isCreateTicketLoading}
                    >
                        <option value={TICKET_TYPES.UPR}>
                            UW Finance Purchase
                        </option>
                        <option value={TICKET_TYPES.PPR}>
                            Personal Purchase
                        </option>
                        <option value={TICKET_TYPES.FI}>Funding Item</option>
                        <option value={TICKET_TYPES.SF}>
                            Sponsorship Fund
                        </option>
                    </Select>
                    {displayTicketType()}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        isLoading={isCreateTicketLoading}
                        colorScheme="blue"
                        onClick={handleSubmit(createTicket)}
                    >
                        Create Ticket
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
