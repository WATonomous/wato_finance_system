import React from 'react'
import {
    Box,
    Card,
    CardBody,
    Flex,
    Heading,
    StackDivider,
    Th,
    Tr,
    Td,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Stack,
    Center,
} from '@chakra-ui/react'
import { getStandardizedDate } from '../utils/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import TreeViewWithLinks from '../components/TreeViewWithLinks'
import { getFormattedCurrency } from '../utils/utils'

const FundingItemView = ({ fundingItem }) => {
    return (
        <Card maxW="100%">
            <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                    <Stack>
                        <Heading size="md" mb="12px">
                            {fundingItem.codename}
                        </Heading>
                        <Heading size="sm">
                            {`Funding Allocation: ${getFormattedCurrency(
                                fundingItem.funding_allocation
                            )}`}
                        </Heading>
                        <Heading size="sm">
                            {`Funding Spent: ${getFormattedCurrency(
                                fundingItem.funding_spent
                            )}`}
                        </Heading>
                    </Stack>
                    {fundingItem.personalPurchases.length > 0 && (
                        <Stack>
                            <Heading size="sm">Personal Purchases</Heading>
                            <TableContainer>
                                <Table
                                    size="md"
                                    __css={{ tableLayout: 'fixed' }}
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Item Name</Th>
                                            <Th isNumeric>Cost</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {fundingItem.personalPurchases.map(
                                            (ppr) => {
                                                return (
                                                    <Tr key={ppr._id}>
                                                        <Td fontSize="sm">
                                                            {ppr.codename}
                                                        </Td>
                                                        <Td
                                                            fontSize="sm"
                                                            isNumeric
                                                        >
                                                            {getFormattedCurrency(
                                                                ppr.cost
                                                            )}
                                                        </Td>
                                                        <Td fontSize="sm">
                                                            {ppr.status}
                                                        </Td>
                                                    </Tr>
                                                )
                                            }
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    )}
                    {fundingItem.uwFinancePurchases.length > 0 && (
                        <Stack>
                            <Heading size="sm">UW Finance Purchases</Heading>
                            <TableContainer>
                                <Table
                                    size="md"
                                    __css={{ tableLayout: 'fixed' }}
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Item Name</Th>
                                            <Th isNumeric>Cost</Th>
                                            <Th>Status</Th>
                                            <Th>Req #</Th>
                                            <Th>PO #</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {fundingItem.uwFinancePurchases.map(
                                            (upr) => {
                                                return (
                                                    <Tr key={upr._id}>
                                                        <Td fontSize="sm">
                                                            {upr.codename}
                                                        </Td>
                                                        <Td
                                                            fontSize="sm"
                                                            isNumeric
                                                        >
                                                            {getFormattedCurrency(
                                                                upr.cost
                                                            )}
                                                        </Td>
                                                        <Td fontSize="sm">
                                                            {upr.status}
                                                        </Td>
                                                        <Td fontSize="sm">
                                                            {
                                                                upr.requisition_number
                                                            }
                                                        </Td>
                                                        <Td fontSize="sm">
                                                            {upr.po_number}
                                                        </Td>
                                                    </Tr>
                                                )
                                            }
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    )}
                </Stack>
            </CardBody>
        </Card>
    )
}

const ClaimSummary = ({ claimData }) => {
    const claimSummaryInfoHeight = 24 + 6 * (24 + 8) + 43.2 + 24 + 2
    const claimSummaryInfoHeightText = `${claimSummaryInfoHeight}px`
    const ticketTreeHeightText = `calc(100vh - ${
        claimSummaryInfoHeight + 80
    }px)`

    if (Object.keys(claimData).length === 0)
        return (
            <Box h="100vh" w="100%">
                <LoadingSpinner />
            </Box>
        )

    return (
        <>
            <Flex
                flexDir="column"
                minW="350px"
                h="calc(100vh - 80px)"
                borderRight="2px solid #dedede"
            >
                <Flex
                    flexDir="column"
                    minH={claimSummaryInfoHeightText}
                    p="24px"
                    gap="8px"
                    borderBottom="2px solid #dedede"
                >
                    <Heading>Claim Summary</Heading>
                    <Heading size="md">{claimData.codename}</Heading>
                    <Heading size="md">
                        {`Proposal ID: ${claimData.proposal_id}`}
                    </Heading>
                    <Heading size="md">
                        {`Deadline: ${getStandardizedDate(
                            claimData.claim_deadline
                        )}`}
                    </Heading>
                    <Heading size="md">{`Status: ${claimData.status}`}</Heading>
                    <Heading size="md">
                        {`Funding Allocation: ${getFormattedCurrency(
                            claimData.funding_allocation
                        )}`}
                    </Heading>
                    <Heading size="md">
                        {`Funding Spent: ${getFormattedCurrency(
                            claimData.funding_spent
                        )}`}
                    </Heading>
                </Flex>
                <Flex
                    w="100%"
                    h={ticketTreeHeightText}
                    overflowY="auto"
                    p="24px"
                >
                    <TreeViewWithLinks />
                </Flex>
            </Flex>
            <Flex
                flexDir="column"
                w="100%"
                h="calc(100vh - 80px)"
                p="24px"
                overflowY="auto"
            >
                <Center flexDir="column" h="max-content" gap="24px">
                    {claimData.fundingItems.map((fi) => {
                        return <FundingItemView fundingItem={fi} key={fi._id} />
                    })}
                </Center>
            </Flex>
        </>
    )
}

export default ClaimSummary
