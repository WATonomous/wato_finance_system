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
                        description={ticketData.status}
                    />
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
                        heading={'Proposal Id'}
                        description={ticketData.proposal_id}
                    />
                    <TicketContentTableRow
                        heading={'Proposal URL'}
                        description={ticketData.proposal_url}
                    />
                    <TicketContentTableRow
                        heading={'Presentation URL'}
                        description={ticketData.presentation_url}
                    />
                    <TicketContentTableRow
                        heading={'Claim Deadline'}
                        description={getStandardizedDate(
                            ticketData.claim_deadline
                        )}
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default SFContentTable
