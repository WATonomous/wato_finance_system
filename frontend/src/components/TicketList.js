import React from 'react'
import { Card, CardBody, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const TicketList = (props) => {
    const navigate = useNavigate()

    const sfCardData = props.sfData.map(sf => ({'name': `${sf.organization} - ${sf.semester}`, 'type': 'SF', 'id': sf._id}))
    const fiCardData = props.fiData.map(fi => ({'name': fi.name, 'type': 'FI', 'id': fi._id}))
    const pprCardData = props.pprData.map(ppr => ({'name': ppr.name, 'type': 'PPR', 'id': ppr._id}))
    const uprCardData = props.uprData.map(upr => ({'name': upr.name, 'type': 'UPR', 'id': upr._id}))
    const allTickets = [].concat(sfCardData, fiCardData, pprCardData, uprCardData)

    return (
        <VStack
            pos='absolute'
            left='0'
            w='300px'
            h='calc(100vh - 80px)'
            overflowY='scroll'
        >
            {allTickets.map(ticket => {
                    const code = `${ticket.type}-${ticket.id}`
                    return (
                        <Card
                            key={code}
                            w='100%'
                            borderTop='1px solid #dedede'
                            borderBottom='1px solid #dedede'
                            borderRadius='0'
                            mt='0 !important'
                            onClick={() => navigate(`/${ticket.type}/${ticket.id}`)}
                            cursor='pointer'
                        >
                            <CardBody
                                p='8px 16px'
                            >
                                <Text>{code}</Text>
                                <Text>{ticket.name}</Text>
                            </CardBody>
                        </Card>
                    )
                }
            )}
        </VStack>
    )
}

export default TicketList