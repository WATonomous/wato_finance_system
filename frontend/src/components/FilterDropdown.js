import React from 'react'
import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useSearchParams } from 'react-router-dom'
import { TICKET_TYPES } from '../constants'

const FilterDropdown = ({ filter, setFilter }) => {
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <Box w="100%" p="16px 16px 0">
            <Menu closeOnSelect={false}>
                <MenuButton
                    as={Button}
                    variant="offWhite"
                    w="100%"
                    rightIcon={<ChevronDownIcon />}
                >
                    Filter Tickets
                </MenuButton>
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            if (
                                filter.length ===
                                Object.keys(TICKET_TYPES).length
                            ) {
                                setFilter([])
                                setSearchParams({
                                    tickettypes: '',
                                })
                            } else {
                                setFilter(Object.keys(TICKET_TYPES))
                                searchParams.delete('tickettypes')
                                setSearchParams(searchParams)
                            }
                        }}
                    >
                        {filter.length === Object.keys(TICKET_TYPES).length
                            ? 'Deselect All'
                            : 'Select All'}
                    </MenuItem>
                    <MenuOptionGroup
                        value={filter}
                        type="checkbox"
                        onChange={(value) => {
                            setFilter(value)
                            // if all filters are selected, no need to have any query params
                            if (
                                value.length ===
                                Object.keys(TICKET_TYPES).length
                            ) {
                                searchParams.delete('tickettypes')
                                setSearchParams(searchParams)
                            } else {
                                setSearchParams({
                                    tickettypes: value.join(','),
                                })
                            }
                        }}
                    >
                        <MenuItemOption value={TICKET_TYPES.SF}>
                            Sponsorship Funds
                        </MenuItemOption>
                        <MenuItemOption value={TICKET_TYPES.FI}>
                            Funding Items
                        </MenuItemOption>
                        <MenuItemOption value={TICKET_TYPES.PPR}>
                            Personal Purchase Requests
                        </MenuItemOption>
                        <MenuItemOption value={TICKET_TYPES.UPR}>
                            UW Finance Purchase Requests
                        </MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
        </Box>
    )
}

export default FilterDropdown
