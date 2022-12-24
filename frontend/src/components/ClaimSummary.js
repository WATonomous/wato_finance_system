import React, { useState, useEffect } from 'react'
import { Box, Flex, Spinner, Heading, Center } from '@chakra-ui/react'
import { getFriendlyDate } from '../utils/dateFormat'
import { useParams } from 'react-router-dom'
const FundingItem = (fundingItem) => {
    const item = fundingItem.fundingItem // weird hack for time being
    // console.log('almost')
    // console.log(fundingItem)
    console.log(item.fundingItem)
    console.log(item.personalPurchases)
    console.log(item.uwFinancePurchases)
    return (
        <Box border="1px" borderRadius="4%" borderColor="black">
            <Heading>{item.name}</Heading>
            <Heading size="md">
                Allocation: {item.funding_allocation}
            </Heading>
            <Flex>
                <h2>PersonalPurchases</h2>
                {item.personalPurchases.map((pp) => {
                    return (
                        <>
                            <Heading>Item Name {pp.name}</Heading>
                            <Heading>Amount Spent: {pp.cost}</Heading>
                            <Heading>
                                Requisition Number: {pp.requisition_number}
                            </Heading>
                            <Heading>
                                Purchase Order Number: {pp.po_number}
                            </Heading>
                            <Center>
                                <h3>Action</h3>
                                <button>Blah</button>
                            </Center>
                        </>
                    )
                })}
            </Flex> 
            <Flex>
                <h2>UW Finance Purchases</h2>
                {item.uwFinancePurchases.map((uwfp) => {
                    return (
                        <>
                            <Heading>Item Name: {uwfp.name}</Heading>
                            <Heading>Item Spent: {uwfp.item}</Heading>
                            <Heading>
                                Requisition Number: {uwfp.requisition_number}
                            </Heading>
                            <Heading>
                                Purchase Order Number: {uwfp.po_number}
                            </Heading>
                            <Center>
                                <h3>Action</h3>
                                <button>Blah</button>
                            </Center>
                        </>
                    )
                })}
            </Flex>
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
            console.log('hello here')
            console.log(data)
            setClaimData(data)
        }
        fetchClaimData()
    }, [id])

    if (!claimData)
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Spinner size="lg" />
            </Box>
        )

    return (
        <Box>
            <Heading>Claim Summary</Heading>
            <Heading size="md">Sponsorship Fund ID: {id}</Heading>
            <Heading size="md">
                Organization: {claimData.organization} {claimData.semester}
            </Heading>
            <Heading size="md">
                Deadline: {getFriendlyDate(claimData.claim_deadline)}
            </Heading>
            <Flex marginTop="5vw">
                {claimData.fundingItems.map((fi) => {
                    return <FundingItem fundingItem={fi} />
                })}
            </Flex>
        </Box>
    )
}

export default ClaimSummary
