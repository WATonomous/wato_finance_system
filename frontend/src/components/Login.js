import React from 'react'
import { Center, Heading, VStack } from '@chakra-ui/react'

import Navbar from './Navbar'

const Login = () => {
    return (
        <VStack spacing="0">
            <Navbar />
            <Center
                pos="absolute"
                top="80px"
                w="100%"
                h="calc(100vh - 80px)"
                bgGradient="linear(to-tl, #23a6d5, #23d5ab)"
            >
                <Heading>
                    Log in to access the WATonomous Finance System
                </Heading>
            </Center>
        </VStack>
    )
}

export default Login
