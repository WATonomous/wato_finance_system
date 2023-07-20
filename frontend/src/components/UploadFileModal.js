import {
    AbsoluteCenter,
    Box,
    Button,
    CloseButton,
    Divider,
    ListItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    UnorderedList,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { FileUploader } from 'react-drag-drop-files'
import { axiosPreset } from '../axiosConfig'
import LoadingSpinner from './LoadingSpinner'
import { currentTicketState } from '../state/atoms'

const fileTypes = ['PNG', 'JPG', 'PDF']
const UploadFileModal = ({ isOpen, onClose }) => {
    const ticket = useRecoilValue(currentTicketState)
    const [filesToUpload, setFilesToUpload] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [filesToDelete, setFilesToDelete] = useState([])

    useEffect(() => {
        axiosPreset
            .get(`/files/getallbyreference/${ticket.code}`)
            .then((res) => {
                setUploadedFiles(res.data)
            })
            .catch((err) => console.log(err))
            .finally(setLoading(false))
    }, [ticket.code])

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
                    `/files/bulk/${ticket.code}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
            }
            await Promise.all([deleteFilesResponses, createFilesResponse])
        } catch (e) {
            console.log(e)
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
