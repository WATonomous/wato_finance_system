import React, { useEffect, useState } from 'react'
import usePreserveParamsNavigate from '../hooks/usePreserveParamsNavigate'
import {
    Card,
    CardBody,
    Center,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    VStack,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import FilterDropdown from './FilterDropdown'
import { useSearchParams } from 'react-router-dom'
import { TICKET_TYPES } from '../constants'
import LoadingSpinner from './LoadingSpinner'
import { useRecoilValue } from 'recoil'
import { allTicketsState } from '../state/atoms'

const TicketList = ({ isLoading }) => {
    const allTickets = useRecoilValue(allTicketsState)
    const preserveParamsNavigate = usePreserveParamsNavigate()
    const [searchParams] = useSearchParams()
    const tickettypes = searchParams.get('tickettypes')
    const [filteredTickets, setFilteredTickets] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState(
        tickettypes
            ? tickettypes.split(',')
            : [
                  TICKET_TYPES.SF,
                  TICKET_TYPES.FI,
                  TICKET_TYPES.PPR,
                  TICKET_TYPES.UPR,
              ]
    )
    const TICKET_LIST_HEIGHT = 'calc(100vh - 210px)'

    useEffect(() => {
        const newFilteredTickets = Object.values(allTickets)
            .flat()
            .filter((ticket) => typeFilter.includes(ticket.type))
            .filter((ticket) => {
                const codeText = ticket.code.toLowerCase()
                const nameText = ticket.name.toLowerCase()
                const searchFilterText = searchFilter.trim().toLowerCase()
                return (
                    codeText.includes(searchFilterText) ||
                    nameText.includes(searchFilterText)
                )
            })
            .sort((a, b) =>
                new Date(a.updatedAt).getTime() <
                new Date(b.updatedAt).getTime()
                    ? 1
                    : -1
            )
        setFilteredTickets(newFilteredTickets)
    }, [allTickets, typeFilter, searchFilter])

    return (
        <Flex
            flexDir="column"
            minW={{ base: '200px', lg: '280px', xl: '300px' }}
            gap="16px"
            border="1px solid #dedede"
        >
            <FilterDropdown filter={typeFilter} setFilter={setTypeFilter} />
            <InputGroup padding="0 16px">
                <InputLeftElement pointerEvents="none" left="unset">
                    <SearchIcon />
                </InputLeftElement>
                <Input
                    value={searchFilter}
                    onChange={(e) => {
                        setSearchFilter(e.target.value)
                    }}
                />
            </InputGroup>
            {isLoading ? (
                <Center
                    w="100%"
                    h={TICKET_LIST_HEIGHT}
                    border="1px solid #dedede"
                >
                    <LoadingSpinner />
                </Center>
            ) : (
                <VStack
                    w="100%"
                    h={TICKET_LIST_HEIGHT}
                    overflowY="scroll"
                    borderTop="1px solid #dedede"
                >
                    {filteredTickets.map((ticket) => {
                        return (
                            <Card
                                key={ticket.code}
                                w="100%"
                                borderTop="1px solid #dedede"
                                borderBottom="1px solid #dedede"
                                borderRadius="0"
                                mt="0 !important"
                                onClick={() =>
                                    preserveParamsNavigate(ticket.path)
                                }
                                cursor="pointer"
                            >
                                <CardBody p="8px 16px">
                                    <Text>{ticket.code}</Text>
                                    <Text noOfLines="1">{ticket.name}</Text>
                                </CardBody>
                            </Card>
                        )
                    })}
                </VStack>
            )}
        </Flex>
    )
}

export default TicketList
