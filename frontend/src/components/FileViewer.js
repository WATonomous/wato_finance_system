import {
    Box,
    Button,
    Flex,
    Image,
    Link,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { Document, Page } from 'react-pdf'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const FilePopUpModal = ({ isOpen, onClose, file }) => {
    const [numPages, setNumPages] = React.useState(null)

    // Function to get the total number of pages in the PDF
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="space-between" alignItems="center">
                        {file.name}
                        <Link href={file.link} isExternal pr="20px">
                            File Link <ExternalLinkIcon mx="2px" />
                        </Link>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />

                {file.mimetype === 'application/pdf' ? (
                    <Box
                        maxHeight="70vh"
                        overflow="auto"
                        display="flex"
                        justifyContent="center"
                    >
                        <Document
                            file={file.link}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            {Array.from(
                                { length: numPages },
                                (_, pageIndex) => (
                                    <Page
                                        key={`page_${pageIndex + 1}`}
                                        pageNumber={pageIndex + 1}
                                    />
                                )
                            )}
                        </Document>
                    </Box>
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
            <Button
                onClick={onOpen}
                wordBreak="break-all"
                whiteSpace="normal"
                textAlign="left"
                height="fit-content"
                py="4px"
            >
                {file.name}
            </Button>
            <FilePopUpModal isOpen={isOpen} onClose={onClose} file={file} />
        </Box>
    )
}

export default FileViewer
