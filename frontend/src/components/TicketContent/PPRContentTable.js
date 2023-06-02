import { Checkbox, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import app from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS, APPROVAL_LEVELS } from '../../constants'

const PPRContentTable = ({ ticketData, partialUpdateAllTickets }) => {
    const auth = useAuth(app)

    const handleUpdateApproval = (approval_level) => async () => {
        const newTicketData = {
            [approval_level]: !ticketData[approval_level],
        }
        const payload = {
            ticket_data: newTicketData,
            approval_type: approval_level,
            identifier: auth.currentIdentifier,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.PPR}/updateapprovals/${ticketData._id}`,
            payload
        )
        partialUpdateAllTickets(ticketData.type, ticketData._id, newTicketData)
    }

    return (
        <VStack>
            <Table mb="12px">
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
                </Tbody>
            </Table>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Director Approval'}
                        description={
                            <Checkbox
                                disabled={!auth.isDirector}
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.director_approval
                                )}
                                isChecked={ticketData.director_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Team Captain Approval'}
                        description={
                            <Checkbox
                                disabled={!auth.isTeamCaptain}
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.team_captain_approval
                                )}
                                isChecked={ticketData.team_captain_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Faculty Advisor Approval'}
                        description={
                            <Checkbox
                                disabled={!auth.isFacultyAdvisor}
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.faculty_advisor_approval
                                )}
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
