import { Checkbox, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import app from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { axiosPreset } from '../../axiosConfig'

const PPRContentTable = ({ ticketData, updatePPRInAllTickets }) => {
    const auth = useAuth(app)

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
                        heading={'Director Approval'}
                        description={
                            <Checkbox
                                disabled={!auth.isDirector}
                                onChange={async () => {
                                    const newTicketData = {
                                        ...ticketData,
                                        director_approval:
                                            !ticketData.director_approval,
                                    }
                                    const payload = {
                                        ticket_data: newTicketData,
                                        approval_type: 'director_approval',
                                        identifier: auth.currentIdentifier,
                                    }
                                    await axiosPreset.put(
                                        `/personalpurchases/updateapprovals/${ticketData._id}`,
                                        payload
                                    )
                                    updatePPRInAllTickets(newTicketData)
                                }}
                                isChecked={ticketData.director_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Team Captain Approval'}
                        description={
                            <Checkbox
                                disabled={!auth.isTeamCaptain}
                                onChange={async () => {
                                    const newTicketData = {
                                        ...ticketData,
                                        team_captain_approval:
                                            !ticketData.team_captain_approval,
                                    }
                                    const payload = {
                                        ticket_data: newTicketData,
                                        approval_type: 'team_captain_approval',
                                        identifier: auth.currentIdentifier,
                                    }
                                    await axiosPreset.put(
                                        `/personalpurchases/updateapprovals/${ticketData._id}`,
                                        payload
                                    )
                                    updatePPRInAllTickets(newTicketData)
                                }}
                                isChecked={ticketData.team_captain_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Faculty Advisor Approval'}
                        description={
                            <Checkbox
                                disabled={!auth.isFacultyAdvisor}
                                onChange={async () => {
                                    const newTicketData = {
                                        ...ticketData,
                                        faculty_advisor_approval:
                                            !ticketData.faculty_advisor_approval,
                                    }
                                    const payload = {
                                        ticket_data: newTicketData,
                                        approval_type:
                                            'faculty_advisor_approval',
                                        identifier: auth.currentIdentifier,
                                    }
                                    await axiosPreset.put(
                                        `/personalpurchases/updateapprovals/${ticketData._id}`,
                                        payload
                                    )
                                    updatePPRInAllTickets(newTicketData)
                                }}
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
