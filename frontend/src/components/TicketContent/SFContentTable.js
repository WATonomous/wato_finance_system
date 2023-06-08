import { Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency, getStandardizedDate } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'

const SFContentTable = (props) => {
    const { ticketData } = props

    return (
        <VStack>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Status'}
                        value={ticketData.status}
                    />
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
                        heading={'Proposal Id'}
                        value={ticketData.proposal_id}
                    />
                    <TicketContentTableRow
                        heading={'Proposal URL'}
                        value={ticketData.proposal_url}
                    />
                    <TicketContentTableRow
                        heading={'Presentation URL'}
                        value={ticketData.presentation_url}
                    />
                    <TicketContentTableRow
                        heading={'Claim Deadline'}
                        value={getStandardizedDate(ticketData.claim_deadline)}
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default SFContentTable
