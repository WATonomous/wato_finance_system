import React from 'react'
import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { TICKET_TYPES } from '../constants'

const FilterDropdown = ({ filter, setFilter }) => {
    return (
        <Box w="100%" p="16px" borderRight="1px solid #dedede">
            <Menu closeOnSelect={false}>
                <MenuButton
                    as={Button}
                    w="100%"
                    rightIcon={<ChevronDownIcon />}
                >
                    Filter Tickets
                </MenuButton>
                <MenuList minWidth="240px">
                    <MenuOptionGroup
                        defaultValue={filter}
                        title="Ticket Type"
                        type="checkbox"
                        onChange={(value) => setFilter(value)}
                    >
                        <MenuItemOption value={`${TICKET_TYPES.SF}`}>
                            Sponsorship Funds
                        </MenuItemOption>
                        <MenuItemOption value={`${TICKET_TYPES.FI}`}>
                            Funding Items
                        </MenuItemOption>
                        <MenuItemOption value={`${TICKET_TYPES.PPR}`}>
                            Personal Purchase Requests
                        </MenuItemOption>
                        <MenuItemOption value={`${TICKET_TYPES.UPR}`}>
                            UW Finance Purchase Requests
                        </MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
        </Box>
    )
}

export default FilterDropdown
