import React from 'react'
import { Td, Th, Tr } from '@chakra-ui/react'

const TicketContentTableRow = (props) => {
    return (
        <Tr borderTopWidth="2px" borderBottomWidth="2px">
            <Th
                w="185px"
                fontSize={{ base: 'xs', md: 'sm' }}
                p={{
                    base: '4px 4px',
                    sm: '8px 8px',
                    lg: '12px 24px',
                }}
            >
                {props.heading}
            </Th>
            <Td
                fontSize={{ base: 'sm', md: 'md' }}
                p={{
                    base: '4px 4px',
                    sm: '8px 8px',
                    lg: '12px 24px',
                }}
            >
                {props.description}
            </Td>
        </Tr>
    )
}

export default TicketContentTableRow
