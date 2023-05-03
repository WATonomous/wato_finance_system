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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

export function CreateTicketModal({ isOpen, onClose }) {
    const [ticketType, setTicketType] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const changeTicketType = (e) => {
        console.log(e.target.value)
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} onCancel={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Select
                        placeholder="Ticket Type"
                        onChange={changeTicketType}
                    >
                        <option value="sf">Sponsorship Fund</option>
                        <option value="fi">Funding Item</option>
                        <option value="ppr">Personal Purchase</option>
                        <option value="upr">UW Finance Purchase</option>
                    </Select>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="ghost">Secondary Action</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
