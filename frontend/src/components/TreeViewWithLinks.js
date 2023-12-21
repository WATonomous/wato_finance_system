import React from 'react'
import { Text, Box, Stack, Link } from '@chakra-ui/react'
import { useGetPreserveParamsHref } from '../hooks/hooks'
import { useRecoilValue } from 'recoil'
import { currentTicketState, currentTreeState } from '../state/atoms'

const TreeViewWithLinks = () => {
    const currentTicket = useRecoilValue(currentTicketState)
    const currentTree = useRecoilValue(currentTreeState)
    const getPreserveParamsHref = useGetPreserveParamsHref()

    const sortTickets = (ticketList) => {
        return [...ticketList].sort((a, b) => (a._id > b._id ? 1 : -1))
    }

    const getFundingItemTree = (fi) => (
        <Box key={fi.code} m="0 !important">
            <Link href={getPreserveParamsHref(fi.path)}>
                <Box
                    bgColor="blue.200"
                    m="4px 10% 0"
                    p="4px 8px"
                    borderRadius="8px"
                >
                    <Text
                        fontWeight={
                            currentTicket.code === fi.code ? '800' : '600'
                        }
                        fontSize="xs"
                    >
                        {fi.codename}
                    </Text>
                </Box>
            </Link>
            {sortTickets(fi.personalPurchases).map((ppr) => {
                return (
                    <Link key={ppr.code} href={getPreserveParamsHref(ppr.path)}>
                        <Box
                            bgColor="cyan.200"
                            m="4px 0 0 20%"
                            p="4px 8px"
                            borderRadius="8px"
                        >
                            <Text
                                fontWeight={
                                    currentTicket.code === ppr.code
                                        ? '800'
                                        : '600'
                                }
                                fontSize="xs"
                            >
                                {ppr.codename}
                            </Text>
                        </Box>
                    </Link>
                )
            })}
            {sortTickets(fi.uwFinancePurchases).map((upr) => {
                return (
                    <Link key={upr.code} href={getPreserveParamsHref(upr.path)}>
                        <Box
                            bgColor="teal.200"
                            m="4px 0 0 20%"
                            p="4px 8px"
                            borderRadius="8px"
                        >
                            <Text
                                fontWeight={
                                    currentTicket.code === upr.code
                                        ? '800'
                                        : '600'
                                }
                                fontSize="xs"
                            >
                                {upr.codename}
                            </Text>
                        </Box>
                    </Link>
                )
            })}
        </Box>
    )

    if (
        !currentTicket.type ||
        !currentTree ||
        Object.keys(currentTree).length === 0
    )
        return <Text>No tree to display</Text>

    // Special Case: WATO Cash
    // OR UPR/PPR with fi_link to WATO Cash
    if (currentTree.sf_link === -1) {
        return <Stack>{getFundingItemTree(currentTree)}</Stack>
    }

    return (
        <Stack w="100%">
            <Link href={getPreserveParamsHref(currentTree.path)}>
                <Box
                    bgColor="purple.200"
                    p="4px 8px"
                    mr="20%"
                    borderRadius="8px"
                >
                    <Text
                        fontWeight={
                            currentTicket.code === currentTree.code
                                ? '800'
                                : '600'
                        }
                        fontSize="xs"
                    >
                        {currentTree.codename}
                    </Text>
                </Box>
            </Link>
            {sortTickets(currentTree.fundingItems).map(getFundingItemTree)}
        </Stack>
    )
}

export default TreeViewWithLinks
