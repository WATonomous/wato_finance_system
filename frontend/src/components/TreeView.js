import React from 'react'
import { Text, Box, Stack } from '@chakra-ui/react'
import { useGetCurrentTicket, usePreserveParamsNavigate } from '../hooks/hooks'
import { useRecoilValue } from 'recoil'
import { currentTreeState } from '../state/atoms'

const TreeView = () => {
    const currentTicket = useGetCurrentTicket()
    const currentTree = useRecoilValue(currentTreeState)
    const preserveParamsNavigate = usePreserveParamsNavigate()

    const sortTickets = (ticketList) => {
        return ticketList.toSorted((a, b) => a._id - b._id)
    }

    const getFundingItemTree = (fi) => (
        <Box key={fi.code} m="0 !important">
            <Box
                bgColor="blue.200"
                m="4px 10% 0"
                p="4px 8px"
                borderRadius="8px"
                cursor="pointer"
                onClick={() => preserveParamsNavigate(fi.path)}
            >
                <Text
                    fontWeight={currentTicket.code === fi.code ? '800' : '600'}
                    fontSize="xs"
                >
                    {fi.codename}
                </Text>
            </Box>
            {sortTickets(fi.personalPurchases).map((ppr) => {
                return (
                    <Box
                        key={ppr.code}
                        bgColor="cyan.200"
                        m="4px 0 0 20%"
                        p="4px 8px"
                        borderRadius="8px"
                        cursor="pointer"
                        onClick={() => preserveParamsNavigate(ppr.path)}
                    >
                        <Text
                            fontWeight={
                                currentTicket.code === ppr.code ? '800' : '600'
                            }
                            fontSize="xs"
                        >
                            {ppr.codename}
                        </Text>
                    </Box>
                )
            })}
            {sortTickets(fi.uwFinancePurchases).map((upr) => {
                return (
                    <Box
                        key={upr.code}
                        bgColor="teal.200"
                        m="4px 0 0 20%"
                        p="4px 8px"
                        borderRadius="8px"
                        cursor="pointer"
                        onClick={() => preserveParamsNavigate(upr.path)}
                    >
                        <Text
                            fontWeight={
                                currentTicket.code === upr.code ? '800' : '600'
                            }
                            fontSize="xs"
                        >
                            {upr.codename}
                        </Text>
                    </Box>
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
        <Stack>
            <Box
                bgColor="purple.200"
                p="4px 8px"
                mr="20%"
                borderRadius="8px"
                cursor="pointer"
                onClick={() => preserveParamsNavigate(currentTree.path)}
            >
                <Text
                    fontWeight={
                        currentTicket.code === currentTree.code ? '800' : '600'
                    }
                    fontSize="xs"
                >
                    {currentTree.codename}
                </Text>
            </Box>
            {sortTickets(currentTree.fundingItems).map(getFundingItemTree)}
        </Stack>
    )
}

export default TreeView
