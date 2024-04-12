import React from 'react'
import { Th, Tr, PopoverTrigger, Td } from '@chakra-ui/react'

const ReporterTableRow = (props) => {
    const { heading, reporter } = props

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
                {heading}
            </Th>

            {!reporter ? (
                <Td
                    fontSize={{ base: 'sm', md: 'md' }}
                    p={{
                        base: '4px 4px',
                        sm: '8px 8px',
                        lg: '12px 24px',
                    }}
                >
                    No Reporter
                </Td>
            ) : (
                <PopoverTrigger>
                    <Td
                        fontSize={{ base: 'sm', md: 'md' }}
                        p={{
                            base: '4px 4px',
                            sm: '8px 8px',
                            lg: '12px 24px',
                        }}
                        cursor="pointer"
                    >
                        {reporter.displayName}
                    </Td>
                </PopoverTrigger>
            )}
        </Tr>
    )
}

export default ReporterTableRow
