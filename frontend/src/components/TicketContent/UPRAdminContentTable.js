import { Button, Center, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import TicketContentTableRow from './TicketContentTableRow'
import { currentTicketState } from '../../state/atoms'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS } from '../../constants'

const UPRAdminContentTable = () => {
    const [ticketData, setTicketData] = useRecoilState(currentTicketState)
    const [changed, setChanged] = React.useState(false)
    const changeReqNumber = (e) => {
        setTicketData({
            ...ticketData,
            requisition_number: e.target.value,
        })
        setChanged(true)
    }
    const changePoNumber = (e) => {
        setTicketData({
            ...ticketData,
            po_number: e.target.value,
        })
        setChanged(true)
    }

    const saveFields = async () => {
        const payload = {
            requisition_number: ticketData.requisition_number,
            po_number: ticketData.po_number,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.UPR}/${ticketData._id}`,
            payload
        )
        setChanged(false)
    }

    return (
        <VStack
            border="1px solid black"
            borderRadius="8px"
            padding="8px"
            mb="30px"
        >
            <Heading size="md">Admin View</Heading>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Purchase Order Number'}
                        value={ticketData?.po_number}
                        onChange={changePoNumber}
                    />
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        value={ticketData?.requisition_number}
                        onChange={changeReqNumber}
                    />
                </Tbody>
            </Table>

            <Center pb="7px">
                <Button
                    colorScheme="blue"
                    size="sm"
                    mr="20px"
                    disabled={
                        ticketData?.po_number?.length +
                            ticketData?.requisition_number?.length ===
                        0
                    }
                >
                    Transition Status
                </Button>

                <Button
                    colorScheme="green"
                    size="sm"
                    disabled={!changed}
                    onClick={saveFields}
                >
                    Save Fields
                </Button>
            </Center>
        </VStack>
    )
}

export default UPRAdminContentTable
