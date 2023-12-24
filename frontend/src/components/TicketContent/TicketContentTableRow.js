import React from 'react'
import { Input, Td, Th, Tr, Link } from '@chakra-ui/react'

const TicketContentTableRow = ({ heading, value, onChange, type }) => {
    return (
        <Tr borderTopWidth="2px" borderBottomWidth="2px">
            <Th
                fontSize={{ base: 'xs', md: 'sm' }}
                p={{
                    base: '4px 4px',
                    sm: '8px 8px',
                    lg: '12px 24px',
                }}
            >
                {heading}
            </Th>
            <Td
                fontSize={{ base: 'sm', md: 'md' }}
                p={{
                    base: '4px 4px',
                    sm: '8px 8px',
                    lg: '12px 24px',
                }}
            >
                {onChange ? (
                    <Input onChange={onChange} value={value} />
                ) : type === 'URL' ? (
                    <Link color="blue.500" href={value} isExternal>
                        {value}
                    </Link>
                ) : (
                    value
                )}
            </Td>
        </Tr>
    )
}

export default TicketContentTableRow
