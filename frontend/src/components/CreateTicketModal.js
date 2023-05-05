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
    Text,
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
    const { register, handleSubmit } = useForm()
    const auth = useAuth(app)

    const displayTicketType = () => {
        switch (ticketType) {
            case 'sf':
                return <SponsorshipFundForm register={register} />
            case 'fi':
                return <FundingItemForm register={register} />
            case 'ppr':
                return <PersonalPurchaseForm register={register} />
            case 'upr':
                return <UWFinancePurchaseForm register={register} />
            default:
                return <Text as="i">Select a ticket type to get started</Text>
        }
    }
    const createTicket = async (e) => {
        const formDetails = e
        const endpoints = {
            sf: '/sponsorshipfunds',
            fi: '/fundingitems',
            ppr: '/personalpurchases',
            upr: '/uwfinancepurchases',
        }
        try {
            const payload = {
                ...formDetails,
                reporter_id: auth.currentUser.uid,
            }
            payload.status = 'SEEKING_APPROVAL'
            if (ticketType === 'upr' || ticketType === 'ppr') {
            } else if (ticketType === 'sf') {
                payload.status = 'ALLOCATED'
            }
            console.log(payload)
            await axiosPreset.post(endpoints[ticketType], payload)
            onClose()
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} onCancel={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormLabel>Ticket Type</FormLabel>

                    <Select
                        placeholder="Ticket Type"
                        onChange={(e) => setTicketType(e.target.value)}
                        margin="10px 0 10px"
                    >
                        <option value="sf">Sponsorship Fund</option>
                        <option value="fi">Funding Item</option>
                        <option value="ppr">Personal Purchase</option>
                        <option value="upr">UW Finance Purchase</option>
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
