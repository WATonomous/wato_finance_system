import {
    Box,
    Button,
    Image,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { Document, Page } from 'react-pdf'

const FilePopUpModal = ({ isOpen, onClose, file }) => {
    console.log(file)
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{file.name}</ModalHeader>
                <ModalCloseButton />
                {file.mimetype === 'application/pdf' ? (
                    <Document file={file.link}>
                        <Page pageNumber={1} />
                    </Document>
                ) : (
                    <Image src={file.link} />
                )}
            </ModalContent>
        </Modal>
    )
}

const FileViewer = ({ file }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box>
            <Button onClick={onOpen}>{file.name}</Button>
            <FilePopUpModal isOpen={isOpen} onClose={onClose} file={file} />
        </Box>
    )
}

export default FileViewer
