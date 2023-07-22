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
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentTicketState, allTicketsState } from '../state/atoms'
import getAllTickets from '../utils/getAllTickets'

const UpdateTicketModal = ({ isOpen, onClose }) => {
    const currentTicket = useRecoilValue(currentTicketState)
    const [allTickets, setAllTickets] = useRecoilState(allTicketsState)
    const { control, register, handleSubmit, formState } = useForm({
        defaultValues: {
            ...currentTicket,
            claim_deadline: new Date(currentTicket.claim_deadline),
            fi_link: {
                label: allTickets[TICKET_TYPES.FI].find(
                    (fi) => fi._id === currentTicket.fi_link
                )?.codename,
                value: currentTicket.fi_link,
            },
            sf_link: {
                label: allTickets[TICKET_TYPES.SF].find(
                    (sf) => sf._id === currentTicket.sf_link
                )?.codename,
                value: currentTicket.sf_link,
            },
        },
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        setIsDisabled(!formState.isDirty)
    }, [formState])

    const displayTicketType = () => {
        const sfOptions = allTickets[TICKET_TYPES.SF].map((ticket) => ({
            label: ticket.codename,
            value: ticket._id,
        }))
        const fiOptions = allTickets[TICKET_TYPES.FI].map((ticket) => ({
            label: ticket.codename,
            value: ticket._id,
        }))

        switch (currentTicket.type) {
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
                    />
                )
            case TICKET_TYPES.PPR:
                return (
                    <PersonalPurchaseForm
                        register={register}
                        control={control}
                        fiOptions={fiOptions}
                    />
                )
            case TICKET_TYPES.UPR:
                return (
                    <UWFinancePurchaseForm
                        register={register}
                        control={control}
                        fiOptions={fiOptions}
                    />
                )
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
                    if (key === 'fi_link' || key === 'sf_link') {
                        return cur
                    }
                    return Object.assign(cur, { [key]: formValues[key] })
                }, {})

            if (
                currentTicket.fi_link !== formValues.fi_link.value &&
                (currentTicket.type === TICKET_TYPES.UPR ||
                    currentTicket.type === TICKET_TYPES.PPR)
            ) {
                await axiosPreset.patch(
                    `${TICKET_ENDPOINTS[currentTicket.type]}/${
                        currentTicket._id
                    }/update_fi_link/${formValues.fi_link.value}`
                )
            } else if (
                currentTicket.sf_link !== formValues.sf_link.value &&
                currentTicket.type === TICKET_TYPES.FI
            ) {
                await axiosPreset.patch(
                    `${TICKET_ENDPOINTS[currentTicket.type]}/${
                        currentTicket._id
                    }/update_sf_link/${formValues.sf_link.value}`
                )
            }

            await axiosPreset.patch(
                `${TICKET_ENDPOINTS[currentTicket.type]}/${currentTicket._id}`,
                payload
            )
            await getAllTickets(setAllTickets)
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

export default UpdateTicketModal
