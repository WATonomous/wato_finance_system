import React from 'react'
import {
    Th,
    Tr,
    Text,
    Image,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    HStack,
    Td,
} from '@chakra-ui/react'

const ReporterInfoTip = (props) => {
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
                <Popover trigger="hover" closeDelay={200} placement="top-start">
                    <PopoverTrigger>
                        <Text
                            fontSize={{ base: 'sm', md: 'md' }}
                            p={{
                                base: '4px 4px',
                                sm: '8px 8px',
                                lg: '12px 24px',
                            }}
                            cursor="pointer"
                        >
                            {reporter.displayName}
                        </Text>
                    </PopoverTrigger>
                    <PopoverContent zIndex="tooltip" width="auto">
                        <Box px={4} py={4}>
                            <HStack spacing="12px">
                                <Image
                                    boxSize="50px"
                                    objectFit="cover"
                                    src={reporter.photoURL}
                                    alt="reporter photo"
                                />
                                <Box flex="1">
                                    <Text
                                        fontSize={{
                                            base: 'sm',
                                            md: 'md',
                                            lg: 'lg',
                                        }}
                                        as="b"
                                        color="blue.600"
                                    >
                                        {reporter.displayName}
                                    </Text>
                                    <br />
                                    <Text
                                        fontSize={{ base: 'xs', md: 'sm' }}
                                        as="u"
                                        color="gray.600"
                                    >
                                        {reporter.email}
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>
                    </PopoverContent>
                </Popover>
            )}
        </Tr>
    )
}

export default ReporterInfoTip
