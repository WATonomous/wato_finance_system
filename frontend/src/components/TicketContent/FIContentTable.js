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
                        description={getFormattedCurrency(
                            ticketData.funding_allocation
                        )}
                    />
                    <TicketContentTableRow
                        heading={'Funding Spent'}
                        description={getFormattedCurrency(
                            ticketData.funding_spent
                        )}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Justification'}
                        description={ticketData.purchase_justification}
                    />
                    <TicketContentTableRow
                        heading={'Sponsorship Fund Link'}
                        description={ticketData.sf_link}
                    />
                    <TicketContentTableRow
                        heading={'Personal Purchase Links'}
                        description={ticketData.ppr_links.join(', ')}
                    />
                    <TicketContentTableRow
                        heading={'UW Finance Purchase Links'}
                        description={ticketData.upr_links.join(', ')}
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default FIContentTable
