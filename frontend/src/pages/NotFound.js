import { Button, Center, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
const NotFound = () => {
    const navigate = useNavigate()

    return (
        <Center flexDir="column" h="100vh" gap="10vh">
            <Heading>404 Not Found!</Heading>
            <Button onClick={() => navigate('/')}>Go to homepage</Button>
        </Center>
    )
}

export default NotFound
