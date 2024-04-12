import React from 'react'
import { Text, Image, Box, PopoverContent, HStack } from '@chakra-ui/react'

const ReporterInfoTip = ({ reporter }) => {
    if (!reporter) return null

    return (
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
    )
}

export default ReporterInfoTip
