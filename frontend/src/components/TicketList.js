import React from 'react'
import { Card, CardBody, Heading, Text, VStack } from '@chakra-ui/react'

const TicketList = (props) => {
    const sfCardData = props.sfData.map(sf => ({'name': `${sf.organization} - ${sf.semester}`, 'id': `SF_${sf._id}`}))
    const fiCardData = props.fiData.map(fi => ({'name': fi.name, 'id': `FI_${fi._id}`}))
    const pprCardData = props.pprData.map(ppr => ({'name': ppr.name, 'id': `PPR_${ppr._id}`}))
    const uprCardData = props.uprData.map(upr => ({'name': upr.name, 'id': `UPR_${upr._id}`}))
    const allTickets = [].concat(sfCardData, fiCardData, pprCardData, uprCardData)
    const temp = allTickets.concat(allTickets)
    return (
        <VStack
            pos='fixed'
            left='0'
            w='300px'
            h='calc(100vh - 80px)'
            overflowY='scroll'
            p='8px 0'
        >
            {temp.map(ticket =>
            <Card
                w='100%'
                m='0'
            >
                <CardBody
                    padding='8px 16px'
                >
                    <Text>{ticket.id}</Text>
                    <Text>{ticket.name}</Text>
                </CardBody>
            </Card>)}
        </VStack>
    )
}

export default TicketList