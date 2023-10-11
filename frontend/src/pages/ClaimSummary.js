import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Heading,
    Th,
    Tr,
    Td,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Button,
    Stack,
    Center,
} from '@chakra-ui/react'
import { getStandardizedDate } from '../utils/utils'
import { axiosPreset } from '../axiosConfig'
import { useLocation, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { useRecoilState } from 'recoil'
import { currentTicketState } from '../state/atoms'
import FileViewer from '../components/FileViewer'

const FundingItemView = ({ fundingItem }) => {
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [currentTicket, setCurrentTicket] = useRecoilState(currentTicketState)
    const getUploadedFiles = useCallback(async () => {
        console.log('hhhh')
        console.log(currentTicket)
        console.log(currentTicket?.code)
        await axiosPreset
            .get(`/files/getallbysf/${currentTicket._id}`)
            .then((res) => {
                console.log('hello')
                console.log(res.data)
                setUploadedFiles(res.data)
            })
            .catch((err) => console.log(err))
    }, [currentTicket, setUploadedFiles])
    useEffect(() => {
        getUploadedFiles()
    }, [getUploadedFiles])
    return (
        <Box
            padding="15px"
            marginTop="2vw"
            border="1px"
            borderRadius="4%"
            borderColor="black"
        >
            <Heading size="md">{fundingItem.name}</Heading>
            <Heading size="md">
                {`Allocation: ${fundingItem.funding_allocation}`}
            </Heading>
            <Heading size="md">
                {`Amount Reimbursed: ${fundingItem.amount_reimbursed}`}
            </Heading>
            <Stack>
                <Heading size="sm">Personal Purchases</Heading>
                <TableContainer>
                    <Table size="lg">
                        <Thead>
                            <Tr>
                                <Th>Item Name</Th>
                                <Th isNumeric>Item Spend</Th>
                                <Th>Requisition Number</Th>
                                <Th>Purchase Order Number</Th>
                                <Th>Attachments</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {fundingItem.personalPurchases.map((pp) => {
                                return (
                                    <Tr key={pp._id}>
                                        <Td>{pp.name}</Td>
                                        <Td isNumeric>{pp.cost}</Td>
                                        <Td>{pp.requisition_number}</Td>
                                        <Td>{pp.po_number}</Td>
                                        <Td>
                                            {uploadedFiles?.map((file) => {
                                                console.log('hello')
                                                console.log(file)
                                                return (
                                                    <FileViewer file={file} />
                                                )
                                            })}
                                        </Td>
                                        <Td>
                                            <Button>Test</Button>
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Stack>
            <Stack>
                <Heading size="sm">UW Finance Purchases</Heading>
                <TableContainer>
                    <Table size="lg">
                        <Thead>
                            <Tr>
                                <Th>Item Name</Th>
                                <Th isNumeric>Item Spend</Th>
                                <Th>Requisition Number</Th>
                                <Th>Purchase Order Number</Th>
                                <Th>Attachments</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {fundingItem.uwFinancePurchases.map((uwfp) => {
                                return (
                                    <Tr key={uwfp._id}>
                                        <Td>{uwfp.name}</Td>
                                        <Td isNumeric>{uwfp.cost}</Td>
                                        <Td>{uwfp.requisition_number}</Td>
                                        <Td>{uwfp.po_number}</Td>
                                        <Td>
                                            {uploadedFiles?.map((file) => {
                                                console.log('hello')
                                                console.log(file)
                                                return (
                                                    <FileViewer file={file} />
                                                )
                                            })}
                                        </Td>
                                        <Td>
                                            <Button>Test</Button>
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Stack>
        </Box>
    )
}

const ClaimSummary = () => {
    const location = useLocation()
    const splitPath = location.pathname.split('/')
    console.log(splitPath)
    const id = splitPath[splitPath.length - 1]
    const [claimData, setClaimData] = useState()
    useEffect(() => {
        const fetchClaimData = async () => {
            const children = axiosPreset.get(
                `${process.env.REACT_APP_BACKEND_URL}/sponsorshipfunds/getallchildren/${id}`
            )
            const files = axiosPreset.get(
                `${process.env.REACT_APP_BACKEND_URL}/files/getallbysf/${id}`
            )
            await Promise.all([children, files])
            setClaimData(children.data)
        }
        fetchClaimData()
    }, [])
    console.log(claimData)

    if (!claimData)
        return (
            <Box h="100vh">
                <LoadingSpinner />
            </Box>
        )

    return (
        <Box>
            <Heading>Claim Summary</Heading>
            <Heading size="md">{`Sponsorship Fund ID: ${id}`}</Heading>
            <Heading size="md">{`Name: ${claimData.name}`}</Heading>
            <Heading size="md">
                {`Deadline: ${getStandardizedDate(claimData.claim_deadline)}`}
            </Heading>
            <Center flexDir="column" marginTop="5vw">
                {claimData.fundingItems.map((fi) => {
                    return <FundingItemView fundingItem={fi} key={fi._id} />
                })}
            </Center>
        </Box>
    )
}

export default ClaimSummary
