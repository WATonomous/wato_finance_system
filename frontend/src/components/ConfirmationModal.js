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

const ConfirmationModal = ({ title, body, onConfirm, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{body}</ModalBody>

                <ModalFooter>
                    <Button variant="redDark" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="greenDark"
                        onClick={() => {
                            onClose()
                            onConfirm()
                        }}
                    >
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmationModal
