import { Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency, getStandardizedDate } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { useRecoilValue } from 'recoil'
import { currentTicketState } from '../../state/atoms'

const SFContentTable = () => {
    const currentTicket = useRecoilValue(currentTicketState)

    return (
        <VStack>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Status'}
                        value={currentTicket.status}
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
                    />
                    <TicketContentTableRow
                        heading={'Presentation URL'}
                        value={currentTicket.presentation_url}
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
