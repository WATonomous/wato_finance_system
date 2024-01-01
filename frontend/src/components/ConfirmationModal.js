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

const ConfirmationModal = ({ onConfirm, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Submission (Placeholder)</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div>
                        Are you sure you want to submit this, you cant undo bla
                        bla bla (PLACEHOLDER)
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="green"
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
