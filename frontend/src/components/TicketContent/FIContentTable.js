import { Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { useRecoilValue } from 'recoil'
import { currentTicketState } from '../../state/atoms'

const FIContentTable = () => {
    const currentTicket = useRecoilValue(currentTicketState)
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
