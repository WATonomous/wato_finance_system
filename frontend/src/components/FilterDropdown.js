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

const FilterDropdown = () => {
    return (
        <Box w="300px" p="16px" borderRight="1px solid #dedede">
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
                        defaultValue={['sf', 'fi', 'ppr', 'upr']}
                        title="Ticket Type"
                        type="checkbox"
                    >
                        <MenuItemOption value="sf">
                            Sponsorship Funds
                        </MenuItemOption>
                        <MenuItemOption value="fi">
                            Funding Items
                        </MenuItemOption>
                        <MenuItemOption value="ppr">
                            Personal Purchase Requests
                        </MenuItemOption>
                        <MenuItemOption value="upr">
                            UW Finance Purchase Requests
                        </MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
        </Box>
    )
}

export default FilterDropdown
