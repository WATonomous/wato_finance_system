import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    Heading,
    Flex,
    VStack,
    Center,
    Table,
    Tbody,
    Button,
    Text,
    useDisclosure,
    Grid,
    useToast,
} from '@chakra-ui/react'
import TreeView from '../components/TreeView'
import Navbar from '../components/Navbar'
import TicketList from '../components/TicketList'
import LoadingSpinner from '../components/LoadingSpinner'
import { getStandardizedDate } from '../utils/utils'
import { useAuth } from '../contexts/AuthContext'
import FIContentTable from '../components/TicketContent/FIContentTable'
import TicketContentTableRow from '../components/TicketContent/TicketContentTableRow'
import SFContentTable from '../components/TicketContent/SFContentTable'
import PPRContentTable from '../components/TicketContent/PPRContentTable'
import UPRContentTable from '../components/TicketContent/UPRContentTable'
import ReporterInfoTip from '../components/ReporterInfoTip'
import { TICKET_TYPES } from '../constants'
import buildTicketTree from '../utils/buildTicketTree'
import DeleteTicketAlertDialog from '../components/DeleteTicketAlertDialog'
import { axiosPreset } from '../axiosConfig'
import { useRecoilState } from 'recoil'
import { allTicketsState, currentFiles, currentTreeState } from '../state/atoms'
import CommentSection from '../components/CommentSection'
import UpdateTicketModal from '../components/UpdateTicketModal'
import UploadFileModal from '../components/UploadFileModal'
import UPRAdminContentTable from '../components/TicketContent/UPRAdminContentTable'
import SFAdminContentTable from '../components/TicketContent/SFAdminContentTable'
import PPRAdminContentTable from '../components/TicketContent/PPRAdminContentTable'
import FIAdminContentTable from '../components/TicketContent/FIAdminContentTable'
import { getAllTickets } from '../utils/globalSetters'
import FileViewer from '../components/FileViewer'
import PPRReporterTable from '../components/TicketContent/PPRReporterTable'
import ClaimSummary from './ClaimSummary'
import { createErrorMessage } from '../utils/errorToasts'
import { useGetCurrentTicket } from '../hooks/hooks'

const Dashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const {
        isOpen: isDeleteTicketOpen,
        onOpen: onOpenDeleteTicket,
        onClose: onCloseDeleteTicket,
    } = useDisclosure()

    const {
        isOpen: isUpdateTicketOpen,
        onOpen: onOpenUpdateTicket,
        onClose: onCloseUpdateTicket,
    } = useDisclosure()

    const {
        isOpen: isUploadModalOpen,
        onOpen: onOpenUploadModal,
        onClose: onCloseUploadModal,
    } = useDisclosure()

    const {
        isOpen: isSupportingDocumentsModalOpen,
        onOpen: onOpenSupportingDocumentsModal,
        onClose: onCloseSupportingDocumentsModal,
    } = useDisclosure()

    const auth = useAuth()
    const [displayClaimSummary, setDisplayClaimSummary] = useState(false)
    const [allUsers, setAllUsers] = useState({ users: [] })
    const [isCurrentTicketReporter, setIsCurrentTicketReporter] =
        useState(false)
    const [currentTree, setCurrentTree] = useRecoilState(currentTreeState)
    const currentTicket = useGetCurrentTicket()
    const [allTickets, setAllTickets] = useRecoilState(allTicketsState)
    const [uploadedFiles, setUploadedFiles] = useRecoilState(currentFiles)
    const attachments = uploadedFiles?.filter(
        (file) => !file.is_supporting_document
    )
    const supportingDocuments = uploadedFiles?.filter(
        (file) => file.is_supporting_document
    )
    const toast = useToast()
    const pageRef = useRef()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                await getAllTickets(setAllTickets)
                const res = await axiosPreset.get('/users')
                setAllUsers({ users: res.data })
            } catch (err) {
                err.customTitle = 'Error Fetching Data!'
                err.customMsg = 'Please refresh and try again'
                toast(createErrorMessage(err))
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [setAllTickets, toast])

    const isReporter = () => {
        return auth.currentUser.uid === currentTicket.reporter_id
    }

    const getUploadedFiles = useCallback(async () => {
        if (!currentTicket?.code) {
            return
        }
        await axiosPreset
            .get(`/files/getallbyreference/${currentTicket.code}`)
            .then((res) => {
                setUploadedFiles(res.data)
            })
            .catch((err) => {
                err.customTitle = 'Failed to fetch files'
                err.customMsg = 'Please try again'
                toast(createErrorMessage(err))
            })
    }, [currentTicket?.code, setUploadedFiles, toast])

    useEffect(() => {
        if (location.pathname === '/') return

        if (!currentTicket) {
            if (!isLoading) {
                navigate('/notfound')
            }
            return
        }
        const splitPath = location.pathname.split('/')
        const isClaimPage = splitPath[1] === 'claim'
        if (isClaimPage) {
            setDisplayClaimSummary(true)
        } else {
            setDisplayClaimSummary(false)
        }

        setCurrentTree(buildTicketTree(currentTicket, allTickets))
        const reporterOverride = process.env?.REACT_APP_REPORTER_OVERRIDE
        setIsCurrentTicketReporter(
            currentTicket.reporter_id === auth.currentUser.uid ||
                reporterOverride
        )
        getUploadedFiles()
    }, [
        location.pathname,
        allTickets,
        isLoading,
        navigate,
        currentTicket,
        setCurrentTree,
        auth.currentUser.uid,
        getUploadedFiles,
        displayClaimSummary,
    ])

    useEffect(() => {
        pageRef.current.scrollTop = 0
    }, [location.pathname])

    const getCurrentTicketContentTable = () => {
        switch (currentTicket.type) {
            case TICKET_TYPES.SF:
                return (
                    <>
                        {auth.isAdmin && <SFAdminContentTable />}
                        <SFContentTable />
                        <CommentSection />
                    </>
                )
            case TICKET_TYPES.FI:
                return (
                    <>
                        {auth.isAdmin && <FIAdminContentTable />}
                        <FIContentTable />
                        <CommentSection />
                    </>
                )

            case TICKET_TYPES.PPR:
                return (
                    <>
                        {auth.isAdmin && <PPRAdminContentTable />}
                        {isReporter() && (
                            <PPRReporterTable
                                supportingDocuments={supportingDocuments}
                                currentTicket={currentTicket}
                            />
                        )}
                        <PPRContentTable />
                        <CommentSection />
                    </>
                )
            case TICKET_TYPES.UPR:
                return (
                    <>
                        {auth.isAdmin && <UPRAdminContentTable />}
                        <UPRContentTable />
                        <CommentSection />
                    </>
                )
            default:
                return null
        }
    }

    const getMainContent = () => {
        if (location.pathname === '/') {
            return (
                <Center w="100%" ref={pageRef}>
                    <Heading fontSize="2xl">Choose a ticket to view</Heading>
                </Center>
            )
        }
        if (isLoading || !currentTicket) {
            return (
                <Center w="100%" ref={pageRef}>
                    <LoadingSpinner />
                </Center>
            )
        }

        return (
            <Flex
                ref={pageRef}
                w="100%"
                h="calc(100vh - 80px)"
                overflowY="auto"
            >
                <Flex
                    flexDir="column"
                    justifyContent="flex-start"
                    h="max-content"
                    w="60%"
                    p="16px 24px"
                >
                    <Heading mb="16px" fontSize="3xl">
                        {currentTicket?.codename}
                    </Heading>
                    {/* Do not display update/delete button for WATO Cash */}
                    {currentTicket.sf_link !== -1 &&
                        (isCurrentTicketReporter || auth.isDirector) && (
                            <Flex
                                flexDir="row"
                                mb="12px"
                                gap="16px"
                                flexWrap="wrap"
                            >
                                <Button
                                    size="sm"
                                    colorScheme="cyan"
                                    onClick={onOpenUpdateTicket}
                                >
                                    <Text>Update</Text>
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    onClick={onOpenDeleteTicket}
                                >
                                    <Text>Delete</Text>
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="gray"
                                    onClick={onOpenUploadModal}
                                >
                                    <Text>Upload Files</Text>
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="blackAlpha"
                                    onClick={onOpenSupportingDocumentsModal}
                                >
                                    <Text>Upload Supporting Documents</Text>
                                </Button>
                            </Flex>
                        )}
                    {getCurrentTicketContentTable()}
                </Flex>
                <VStack w="40%" h="max-content" p="16px 24px 16px 0" gap="16px">
                    <Box w="100%">
                        <Heading mb="8px" fontSize="2xl">
                            Ticket Tree
                        </Heading>
                        <TreeView />
                    </Box>
                    <Box w="100%" mt="12px">
                        <Heading mb="8px" fontSize="2xl">
                            Metadata
                        </Heading>
                        <Table>
                            <Tbody>
                                <ReporterInfoTip
                                    heading={'Reporter Id'}
                                    reporter={allUsers.users.find(
                                        (user) =>
                                            user.uid ===
                                            currentTicket.reporter_id
                                    )}
                                />
                                <TicketContentTableRow
                                    heading={'Created at'}
                                    value={getStandardizedDate(
                                        currentTicket.createdAt
                                    )}
                                />
                                <TicketContentTableRow
                                    heading={'Updated at'}
                                    value={getStandardizedDate(
                                        currentTicket.updatedAt
                                    )}
                                />
                            </Tbody>
                        </Table>
                    </Box>
                    {supportingDocuments.length > 0 && (
                        <Box w="100%" mt="12px">
                            <Heading mb="8px" fontSize="2xl">
                                Supporting Documents
                            </Heading>
                            <Grid gap="5px">
                                {supportingDocuments?.map((file) => {
                                    return <FileViewer file={file} />
                                })}
                            </Grid>
                        </Box>
                    )}
                    {attachments.length > 0 && (
                        <Box w="100%" mt="12px">
                            <Heading mb="8px" fontSize="2xl">
                                Uploaded Files
                            </Heading>
                            <Grid gap="5px">
                                {attachments?.map((file) => {
                                    return <FileViewer file={file} />
                                })}
                            </Grid>
                        </Box>
                    )}
                </VStack>
            </Flex>
        )
    }

    return (
        <VStack spacing="0">
            <Navbar />
            <Flex pos="absolute" top="80px" w="100%">
                {displayClaimSummary ? (
                    <ClaimSummary claimData={currentTree} />
                ) : (
                    <>
                        <TicketList isLoading={isLoading} />
                        {getMainContent()}
                    </>
                )}
            </Flex>
            {isUploadModalOpen && (
                <UploadFileModal
                    isOpen={isUploadModalOpen}
                    onClose={onCloseUploadModal}
                    startingUploadedFiles={uploadedFiles?.filter(
                        (file) => !file.is_supporting_document
                    )}
                    refetchFiles={getUploadedFiles}
                    isSupportingDocument={false}
                />
            )}
            {isSupportingDocumentsModalOpen && (
                <UploadFileModal
                    isOpen={isSupportingDocumentsModalOpen}
                    onClose={onCloseSupportingDocumentsModal}
                    startingUploadedFiles={uploadedFiles?.filter(
                        (file) => file.is_supporting_document
                    )}
                    refetchFiles={getUploadedFiles}
                    isSupportingDocument={true}
                />
            )}
            {isDeleteTicketOpen && (
                <DeleteTicketAlertDialog
                    isOpen={isDeleteTicketOpen}
                    onClose={onCloseDeleteTicket}
                />
            )}
            {isUpdateTicketOpen && (
                <UpdateTicketModal
                    isOpen={isUpdateTicketOpen}
                    onClose={onCloseUpdateTicket}
                />
            )}
        </VStack>
    )
}

export default Dashboard
