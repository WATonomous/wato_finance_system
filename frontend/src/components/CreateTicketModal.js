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
    useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { axiosPreset } from '../axiosConfig'
import {
    FundingItemForm,
    PersonalPurchaseForm,
    SponsorshipFundForm,
    UWFinancePurchaseForm,
} from './TicketForms'
import { TICKET_ENDPOINTS, TICKET_TYPES } from '../constants'
import { useRecoilState } from 'recoil'
import { allTicketsState } from '../state/atoms'
import { getAllTickets } from '../utils/globalSetters'
import { usePreserveParamsNavigate } from '../hooks/hooks'
import { createErrorMessage } from '../utils/errorToasts'

export function CreateTicketModal({ isOpen, onClose }) {
    const [allTickets, setAllTickets] = useRecoilState(allTicketsState)
    const [ticketType, setTicketType] = useState('')
    const { control, register, handleSubmit, reset } = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const preserveParamsNavigate = usePreserveParamsNavigate()
    const auth = useAuth()
    const toast = useToast()

    const displayTicketType = () => {
        const sfOptions = allTickets[TICKET_TYPES.SF].map((ticket) => ({
            label: ticket.codename,
            value: ticket._id,
        }))
        const fiOptions = allTickets[TICKET_TYPES.FI].map((ticket) => ({
            label: ticket.codename,
            value: ticket._id,
        }))

        switch (ticketType) {
            case TICKET_TYPES.SF:
                return (
                    <SponsorshipFundForm
                        register={register}
                        control={control}
                    />
                )
            case TICKET_TYPES.FI:
                return (
                    <FundingItemForm
                        register={register}
                        control={control}
                        sfOptions={sfOptions}
                        showSFLink
                    />
                )
            case TICKET_TYPES.PPR:
                return (
                    <PersonalPurchaseForm
                        register={register}
                        control={control}
                        fiOptions={fiOptions}
                        showFILink
                    />
                )
            case TICKET_TYPES.UPR:
                return (
                    <UWFinancePurchaseForm
                        register={register}
                        control={control}
                        fiOptions={fiOptions}
                        showFILink
                    />
                )
            default:
                return null
        }
    }
    const createTicket = async (formValues) => {
        try {
            setIsLoading(true)
            const payload = {
                ...formValues,
                reporter_id: auth.currentUser.uid,
            }
            if (ticketType.length === 0) {
                const error = new Error("Error!")
                error.customMsg = "Please select a ticket type"
                throw error
            }
            if (
                ticketType === TICKET_TYPES.UPR ||
                ticketType === TICKET_TYPES.PPR
            ) {
                payload.fi_link = formValues.fi_link.value
                payload.status = 'SEEKING_APPROVAL'
            } else if (ticketType === TICKET_TYPES.FI) {
                payload.sf_link = formValues.sf_link.value
            } else if (ticketType === TICKET_TYPES.SF) {
                payload.status = 'ALLOCATED'
            }
            const createdTicket = await axiosPreset.post(
                TICKET_ENDPOINTS[ticketType],
                payload
            )
            await getAllTickets(setAllTickets)
            onClose()
            preserveParamsNavigate(`/${ticketType}/${createdTicket.data._id}`)
        } catch (err) {
            toast(createErrorMessage(err))
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
                        isDisabled={isLoading}
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
                        isLoading={isLoading}
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
