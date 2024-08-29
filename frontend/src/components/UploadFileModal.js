import {
    AbsoluteCenter,
    Box,
    Button,
    CloseButton,
    Divider,
    Link,
    ListItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    UnorderedList,
    useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { FileUploader } from 'react-drag-drop-files'
import { axiosPreset } from '../axiosConfig'
import LoadingSpinner from './LoadingSpinner'
import { createErrorMessage } from '../utils/errorToasts'
import { useGetCurrentTicket } from '../hooks/hooks'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const fileTypes = ['PNG', 'JPG', 'PDF']
const UploadFileModal = ({
    isOpen,
    onClose,
    startingUploadedFiles,
    refetchFiles,
    isSupportingDocument,
}) => {
    const ticket = useGetCurrentTicket()
    const [filesToUpload, setFilesToUpload] = useState([])
    const [uploadedFiles, setUploadedFiles] = useState(startingUploadedFiles)
    const [filesToDelete, setFilesToDelete] = useState([])
    const toast = useToast()

    const onFileAttach = (attachedFile) => {
        setFilesToUpload([...filesToUpload, attachedFile])
    }

    const submitFiles = async () => {
        let deleteFilesResponses = null
        let createFilesResponse = null
        try {
            if (filesToDelete.length > 0) {
                deleteFilesResponses = await Promise.all(
                    filesToDelete.map((file) => {
                        return axiosPreset.delete(
                            `/files/${ticket.code}/${file.name}`
                        )
                    })
                )
            }
            if (filesToUpload.length > 0) {
                const formData = new FormData()
                filesToUpload.forEach((file) => {
                    formData.append('files', file)
                })
                createFilesResponse = axiosPreset.post(
                    `/files/bulk/${ticket.code}?isSupportingDocument=${isSupportingDocument}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
            }
            await Promise.all([deleteFilesResponses, createFilesResponse])
            await refetchFiles()
        } catch (err) {
            toast(createErrorMessage(err))
        } finally {
            onClose()
        }
    }
    const removeFile = (fileToRemoveName) => {
        setFilesToUpload(
            filesToUpload.filter((file) => file !== fileToRemoveName)
        )
    }
    const removeUploadedFile = (fileToRemoveName) => {
        setFilesToDelete([...filesToDelete, fileToRemoveName])
        setUploadedFiles(
            uploadedFiles.filter((file) => file !== fileToRemoveName)
        )
    }
    if (!isOpen) {
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
                <ModalHeader>
                    {isSupportingDocument
                        ? 'Upload Expense Claim Form'
                        : 'Upload Files'}
                </ModalHeader>
                <ModalBody>
                    {isSupportingDocument && (
                        <Box marginBottom="10px">
                            <Link
                                href="https://wiki.watonomous.ca/finance/creating_personal_purchases"
                                color="blue.600"
                                isExternal
                            >
                                Expense Claim Form Guide
                                <ExternalLinkIcon mx="2px" />
                            </Link>
                        </Box>
                    )}
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
                            <ListItem
                                display="flex"
                                alignItems="center"
                                key={file.name}
                            >
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
                        {uploadedFiles.map((file) => (
                            <ListItem
                                display="flex"
                                alignItems="center"
                                key={file.name}
                            >
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
                        isDisabled={
                            filesToUpload.length === 0 &&
                            filesToDelete.length === 0
                        }
                        colorScheme="blue"
                        onClick={submitFiles}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UploadFileModal
