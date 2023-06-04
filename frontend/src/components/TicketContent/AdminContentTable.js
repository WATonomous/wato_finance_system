import { Button, Heading, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { currentTicketState } from '../../state/atoms'

const AdminContentTable = () => {
    const [ticketData, setTicketData] = useRecoilState(currentTicketState)
    return (
        <VStack backgroundColor="lightgreen">
            <Heading>Admin View</Heading>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        description={getFormattedCurrency(
                            ticketData.funding_allocation
                        )}
                    />
                    <TicketContentTableRow
                        heading={'PO Number'}
                        description={getFormattedCurrency(
                            ticketData.funding_spent
                        )}
                    />
                    <Button>Ordered</Button>
                </Tbody>
            </Table>
        </VStack>
    )
}

export default AdminContentTable
