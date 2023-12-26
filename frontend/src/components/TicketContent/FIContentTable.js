import { Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { useGetCurrentTicket } from '../../hooks/hooks'

const FIContentTable = () => {
    const currentTicket = useGetCurrentTicket()
    return (
        <VStack>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Funding Allocation'}
                        value={getFormattedCurrency(
                            currentTicket.funding_allocation
                        )}
                    />
                    <TicketContentTableRow
                        heading={'Funding Spent'}
                        value={getFormattedCurrency(
                            currentTicket.funding_spent
                        )}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Justification'}
                        value={currentTicket.purchase_justification}
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default FIContentTable
