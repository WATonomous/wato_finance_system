import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Flex, Heading, Spacer } from '@chakra-ui/react'

const Navbar = (props) => {
    const navigate = useNavigate()

    return (
        <Flex
            pos="fixed"
            top="0"
            left="0"
            alignItems="center"
            p="16px 24px"
            bgColor="deepskyblue"
            w="100%"
            h="80px"
            zIndex="banner"
        >
            <Heading
                lineHeight="48px"
                onClick={() => navigate('/')}
                cursor="pointer"
            >
                WATonomous Finance System
            </Heading>
            <Spacer />
            <Button onClick={props.onClick} disabled={props.authButtonDisabled}>
                {props.authButtonText}
            </Button>
        </Flex>
    )
}

export default Navbar
