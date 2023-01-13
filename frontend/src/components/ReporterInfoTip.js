import React from 'react'
import {
    Td,
    Th,
    Tr,
    Text,
    Image,
    Flex,
    Center,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@chakra-ui/react'

const ReporterInfoTip = (props) => {
    const { ticketData, heading, reporter } = props

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
                <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    p={{
                        base: '4px 4px',
                        sm: '8px 8px',
                        lg: '12px 24px',
                    }}
                >
                    No Reporter
                </Text>
            ) : (
                <Popover
                    trigger="hover"
                    closeDelay={200}
                    placement="bottom-start"
                >
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
                    <PopoverContent>
                        <Box px={4} py={4}>
                            <Flex>
                                <Center w="80px">
                                    <Image
                                        boxSize="60px"
                                        objectFit="cover"
                                        src={reporter.photoURL}
                                        alt=""
                                    />
                                </Center>
                                <Box flex="1">
                                    <Text
                                        fontSize={{
                                            base: 'md',
                                            md: 'lg',
                                            lg: 'xl',
                                        }}
                                        as="b"
                                        color="blue.600"
                                    >
                                        {reporter.displayName}
                                    </Text>
                                    <br />
                                    <Text
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        as="u"
                                        color="gray.600"
                                    >
                                        {reporter.email}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </PopoverContent>
                </Popover>
            )}
        </Tr>
    )
}

export default ReporterInfoTip
