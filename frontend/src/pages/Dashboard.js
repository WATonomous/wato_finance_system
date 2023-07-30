import React, { useCallback, useEffect, useState } from 'react'
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
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
    allTicketsState,
    currentFiles,
    currentTicketState,
    currentTreeState,
} from '../state/atoms'
import UpdateTicketModal from '../components/UpdateTicketModal'
import UploadFileModal from '../components/UploadFileModal'
import UPRAdminContentTable from '../components/TicketContent/UPRAdminContentTable'
import SFAdminContentTable from '../components/TicketContent/SFAdminContentTable'
import PPRAdminContentTable from '../components/TicketContent/PPRAdminContentTable'
import FIAdminContentTable from '../components/TicketContent/FIAdminContentTable'
import { getAllTickets } from '../utils/globalSetters'
import FileViewer from '../components/FileViewer'
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

    const auth = useAuth()
    const [allUsers, setAllUsers] = useState({ users: [] })
    const [isCurrentTicketReporter, setIsCurrentTicketReporter] =
        useState(false)
    const setCurrentTree = useSetRecoilState(currentTreeState)
    const [currentTicket, setCurrentTicket] = useRecoilState(currentTicketState)
    const [allTickets, setAllTickets] = useRecoilState(allTicketsState)
    const [uploadedFiles, setUploadedFiles] = useRecoilState(currentFiles)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                await getAllTickets(setAllTickets)
                const res = await axiosPreset.get('/users')
                setAllUsers({ users: res.data })
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [setAllTickets])

    const getUploadedFiles = useCallback(async () => {
        if (!currentTicket?.code) {
            return
        }
        await axiosPreset
            .get(`/files/getallbyreference/${currentTicket.code}`)
            .then((res) => {
                setUploadedFiles(res.data)
            })
            .catch((err) => console.log(err))
    }, [currentTicket.code, setUploadedFiles])

    useEffect(() => {
        if (location.pathname === '/') return
        const splitPath = location.pathname.split('/')
        if (
            splitPath.length !== 3 ||
            !Object.values(TICKET_TYPES).includes(splitPath[1])
        ) {
            navigate('/notfound')
            return
        }

        const currentTicketType = splitPath[1]
        const currentTicketId = parseInt(splitPath[2])
        const currentTicketData = allTickets[
            TICKET_TYPES[currentTicketType]
        ].find((ticket) => ticket._id === currentTicketId)

        if (!currentTicketData) {
            if (!isLoading) {
                navigate('/notfound')
            }
            return
        }
        setCurrentTicket(currentTicketData)
        setCurrentTree(buildTicketTree(currentTicketData, allTickets))
        const reporterOverride = process.env?.REACT_APP_REPORTER_OVERRIDE
        setIsCurrentTicketReporter(
            currentTicketData.reporter_id === auth.currentUser.uid ||
                reporterOverride
        )
        getUploadedFiles()
    }, [
        location.pathname,
        allTickets,
        isLoading,
        navigate,
        setCurrentTicket,
        setCurrentTree,
        auth.currentUser.uid,
        getUploadedFiles,
    ])

    const getCurrentTicketContentTable = () => {
        switch (currentTicket.type) {
            case TICKET_TYPES.SF:
                return (
                    <>
                        {auth.isAdmin && <SFAdminContentTable />}
                        <SFContentTable />
                    </>
                )
            case TICKET_TYPES.FI:
                return (
                    <>
                        {auth.isAdmin && <FIAdminContentTable />}
                        <FIContentTable />
                    </>
                )

            case TICKET_TYPES.PPR:
                return (
                    <>
                        {auth.isAdmin && <PPRAdminContentTable />}
                        <PPRContentTable />
                    </>
                )
            case TICKET_TYPES.UPR:
                return (
                    <>
                        {auth.isAdmin && <UPRAdminContentTable />}
                        <UPRContentTable />
                    </>
                )
            default:
                return null
        }
    }

    const getMainContent = () => {
        if (location.pathname === '/') {
            return (
                <Center w="100%">
                    <Heading fontSize="2xl">Choose a ticket to view</Heading>
                </Center>
            )
        }
        if (isLoading) {
            return (
                <Center w="100%">
                    <LoadingSpinner />
                </Center>
            )
        }

        return (
            <Flex
                w="100%"
                h="calc(100vh - 80px)"
                overflowY="auto"
                // zIndex="tooltip"
            >
                <Flex
                    flexDir="column"
                    justifyContent="flex-start"
                    h="max-content"
                    w="60%"
                    p="16px 24px"
                >
                    <Heading mb="16px" fontSize="3xl">
                        {currentTicket.codename}
                    </Heading>
                    {/* Do not display update/delete button for WATO Cash */}
                    {currentTicket.sf_link !== -1 &&
                        (isCurrentTicketReporter || auth.isDirector) && (
                            <Flex flexDir="row" mb="12px" gap="16px">
                                <Button
                                    size="sm"
                                    colorScheme="gray"
                                    onClick={onOpenUploadModal}
                                >
                                    <Text>Upload Files</Text>
                                </Button>
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
                    <Box w="100%" mt="12px">
                        <Heading mb="8px" fontSize="2xl">
                            Attachments
                        </Heading>
                        <Grid gap="5px">
                            {uploadedFiles?.map((file) => {
                                return <FileViewer file={file} />
                            })}
                        </Grid>
                    </Box>
                </VStack>
            </Flex>
        )
    }

    return (
        <VStack spacing="0">
            <Navbar />
            <Flex pos="absolute" top="80px" w="100%">
                <TicketList isLoading={isLoading} />
                {getMainContent()}
            </Flex>
            {isUploadModalOpen && (
                <UploadFileModal
                    isOpen={isUploadModalOpen}
                    onClose={onCloseUploadModal}
                    startingUploadedFiles={uploadedFiles}
                    refetchFiles={getUploadedFiles}
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
