import React, { useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Center,
    Th,
    Tr,
    Td,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Button,
    Stack,
} from '@chakra-ui/react'
import { getSFName, getStandardizedDate } from '../utils/utils'
import { useParams } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

const FundingItemView = ({ fundingItem }) => {
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
    const { id } = useParams()
    const [claimData, setClaimData] = useState()
    useEffect(() => {
        const fetchClaimData = async () => {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/sponsorshipfunds/getallchildren/${id}`
            )
            const data = await res.json()
            setClaimData(data)
        }
        fetchClaimData()
    }, [id])

    if (!claimData) return <Box h="100vh"><LoadingSpinner /></Box>

    return (
        <Box>
            <Heading>Claim Summary</Heading>
            <Heading size="md">{`Sponsorship Fund ID: ${id}`}</Heading>
            <Heading size="md">
                {`Organization: ${getSFName(
                    claimData.organization,
                    claimData.semester
                )}`}
            </Heading>
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
