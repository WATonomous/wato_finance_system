import {
    AbsoluteCenter,
    Box,
    Button,
    CloseButton,
    Divider,
    Heading,
    ListIcon,
    ListItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    UnorderedList,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { FileUploader } from 'react-drag-drop-files'
import { axiosPreset } from '../axiosConfig'
import LoadingSpinner from './LoadingSpinner'

const fileTypes = ['PNG', 'JPG', 'PDF']
const UploadFileModal = ({ isOpen, onClose, endpointToSave }) => {
    const [filesToUpload, setFilesToUpload] = useState([])
    const [loading, isLoading] = useState(true)
    const [uploadedFiles, setUploadedFiles] = useState([])

    const onFileAttach = (attachedFile) => {
        setFilesToUpload([...filesToUpload, attachedFile])
        console.log(attachedFile)
    }
    const submitFiles = () => {
        // call an api endpoint which is given via props
        // pass the files to the api endpoint
        axiosPreset.post(endpointToSave, filesToUpload)
        onClose()
    }
    const removeFile = (fileToRemoveName) => {
        setFilesToUpload(
            filesToUpload.filter((file) => file !== fileToRemoveName)
        )
    }
    if (loading) {
        return <LoadingSpinner />
    }
    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Upload Document</ModalHeader>
                <ModalBody>
                    <FileUploader
                        handleChange={onFileAttach}
                        name="file"
                        types={fileTypes}
                    />
                    <Box position="relative" mt="10px" padding="20px 0">
                        <Divider
                            orientation="horizontal"
                            size="md"
                            borderColor="black"
                        />
                        <AbsoluteCenter bg="white" px="4">
                            Files to Upload
                        </AbsoluteCenter>
                    </Box>
                    <UnorderedList ml="0">
                        {filesToUpload.map((file) => (
                            <ListItem display="flex" alignItems="center">
                                {file.name}{' '}
                                <CloseButton onClick={() => removeFile(file)} />
                            </ListItem>
                        ))}
                    </UnorderedList>
                    <Box position="relative">
                        <Divider
                            m="20px 0"
                            orientation="horizontal"
                            size="md"
                            borderColor="black"
                        />
                        <AbsoluteCenter bg="white" px="4">
                            Files Uploaded
                        </AbsoluteCenter>
                    </Box>
                    <UnorderedList ml="0">
                        {filesToUpload.map((file) => (
                            <ListItem display="flex" alignItems="center">
                                {file.name}{' '}
                                <CloseButton onClick={() => removeFile(file)} />
                            </ListItem>
                        ))}
                    </UnorderedList>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        isDisabled={filesToUpload.length === 0}
                        colorScheme="blue"
                        onClick={submitFiles}
                    >
                        Update Ticket
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UploadFileModal
