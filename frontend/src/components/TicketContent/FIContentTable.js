import { Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'

const FIContentTable = (props) => {
    const { ticketData } = props
    return (
        <VStack>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Funding Allocation'}
                        value={getFormattedCurrency(
                            ticketData.funding_allocation
                        )}
                    />
                    <TicketContentTableRow
                        heading={'Funding Spent'}
                        value={getFormattedCurrency(ticketData.funding_spent)}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Justification'}
                        value={ticketData.purchase_justification}
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default FIContentTable
