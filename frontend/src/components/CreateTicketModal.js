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

export function CreateTicketModal({ isOpen, onClose }) {
    const [ticketType, setTicketType] = useState('')
    const { control, register, handleSubmit, reset } = useForm()
    const auth = useAuth(app)

    const displayTicketType = () => {
        switch (ticketType) {
            case 'sf':
                return (
                    <SponsorshipFundForm
                        register={register}
                        control={control}
                    />
                )
            case 'fi':
                return <FundingItemForm register={register} />
            case 'ppr':
                return <PersonalPurchaseForm register={register} />
            case 'upr':
                return <UWFinancePurchaseForm register={register} />
            default:
                return null
        }
    }
    const createTicket = async (formValues) => {
        const endpoints = {
            sf: '/sponsorshipfunds',
            fi: '/fundingitems',
            ppr: '/personalpurchases',
            upr: '/uwfinancepurchases',
        }
        try {
            const payload = {
                ...formValues,
                reporter_id: auth.currentUser.uid,
            }
            if (ticketType === 'upr' || ticketType === 'ppr') {
                payload.status = 'SEEKING_APPROVAL'
            } else if (ticketType === 'sf') {
                payload.status = 'ALLOCATED'
            }
            await axiosPreset.post(endpoints[ticketType], payload)
            onClose()
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} onCancel={onClose} size="lg">
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
                    >
                        <option value="upr">UW Finance Purchase</option>
                        <option value="ppr">Personal Purchase</option>
                        <option value="fi">Funding Item</option>
                        <option value="sf">Sponsorship Fund</option>
                    </Select>
                    {displayTicketType()}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
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
