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
import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import { FileUploader } from 'react-drag-drop-files'
import { axiosPreset } from '../axiosConfig'
import LoadingSpinner from './LoadingSpinner'
import { currentTicketState } from '../state/atoms'

const fileTypes = ['PNG', 'JPG', 'PDF']
const UploadFileModal = ({ isOpen, onClose, endpointToSave }) => {
    const ticket = useRecoilValue(currentTicketState)
    const [filesToUpload, setFilesToUpload] = useState([])
    const originalFiles = useRef([])
    const [loading, isLoading] = useState(true)
    const [uploadedFiles, setUploadedFiles] = useState([])

    useEffect(() => {
        axiosPreset
            .get(`/files/getallbyreference/${ticket._id}`)
            .then((res) => {
                setUploadedFiles(res.data)
                originalFiles.current = res.data
            })
            .catch((err) => console.log(err))
            .finally(isLoading)
    }, [ticket._id])

    const onFileAttach = (attachedFile) => {
        setFilesToUpload([...filesToUpload, attachedFile])
        console.log(attachedFile)
    }

    const submitFiles = async () => {
        const allFiles = [...filesToUpload, ...uploadedFiles]
        // perform a diff here. call a delete for all files that are not in allFiles
        const filesToDelete = originalFiles.current.filter(
            (file) => !allFiles.includes(file)
        )
        const deleteFilesResponse = axiosPreset.delete('/files/bulk', {
            ids: filesToDelete.map((file) => file._id),
        })
        const createFilesResponse = axiosPreset.post('/files/bulk', {
            files: filesToUpload,
            referenceItem: ticket._id,
        })
        await Promise.all([deleteFilesResponse, createFilesResponse])
        onClose()
    }
    const removeFile = (fileToRemoveName) => {
        setFilesToUpload(
            filesToUpload.filter((file) => file !== fileToRemoveName)
        )
    }
    const removeUploadedFile = (fileToRemoveName) => {
        setUploadedFiles(
            uploadedFiles.filter((file) => file !== fileToRemoveName)
        )
    }
    if (loading && isOpen) {
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
                                <CloseButton
                                    onClick={() => removeUploadedFile(file)}
                                />
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
