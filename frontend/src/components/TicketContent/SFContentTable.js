import { Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency, getStandardizedDate } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { useGetCurrentTicket } from '../../hooks/hooks'

const SFContentTable = () => {
    const currentTicket = useGetCurrentTicket()
    const statusToText = {
        ALLOCATED: 'Allocated',
        CLAIM_SUBMITTED: 'Claim Submitted',
        REIMBURSED: 'Reimbursed',
    }

    return (
        <VStack>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Status'}
                        value={statusToText[currentTicket.status]}
                    />
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
                        heading={'Proposal Id'}
                        value={currentTicket.proposal_id}
                    />
                    <TicketContentTableRow
                        heading={'Proposal URL'}
                        value={currentTicket.proposal_url}
                        type="URL"
                    />
                    <TicketContentTableRow
                        heading={'Presentation URL'}
                        value={currentTicket.presentation_url}
                        type="URL"
                    />
                    <TicketContentTableRow
                        heading={'Claim Deadline'}
                        value={getStandardizedDate(
                            currentTicket.claim_deadline
                        )}
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default SFContentTable
