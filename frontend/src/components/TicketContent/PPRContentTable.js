import { Checkbox, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'

const PPRContentTable = (props) => {
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
                        heading={'Cost'}
                        description={getFormattedCurrency(ticketData.cost)}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Justification'}
                        description={ticketData.purchase_justification}
                    />
                    <TicketContentTableRow
                        heading={'Purchase URL'}
                        description={ticketData.purchase_url}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Order Number'}
                        description={ticketData.po_number}
                    />
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        description={ticketData.requisition_number}
                    />
                    <TicketContentTableRow
                        heading={'Funding Item Link'}
                        description={ticketData.fi_link}
                    />
                </Tbody>
            </Table>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Finance Team Approval'}
                        description={
                            <Checkbox
                                isChecked={ticketData.finance_team_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Team Captain Approval'}
                        description={
                            <Checkbox
                                isChecked={ticketData.team_captain_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Faculty Advisor Approval'}
                        description={
                            <Checkbox
                                isChecked={ticketData.faculty_advisor_approval}
                            />
                        }
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default PPRContentTable
