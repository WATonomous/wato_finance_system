import { Button, Flex, Heading, Spacer } from '@chakra-ui/react'
import React from 'react'

const Navbar = (props) => {
    return (
        <Flex
            alignItems='center'
            p='16px 24px'
            bgColor='deepskyblue'
        >
            <Heading lineHeight='48px'>
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