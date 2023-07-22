import { Checkbox, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { useAuth } from '../../contexts/AuthContext'
import { axiosPreset } from '../../axiosConfig'
import { TICKET_ENDPOINTS, APPROVAL_LEVELS } from '../../constants'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { allTicketsState, currentTicketState } from '../../state/atoms'
import getAllTickets from '../../utils/getAllTickets'

const PPRContentTable = () => {
    const auth = useAuth()
    const currentTicket = useRecoilValue(currentTicketState)
    const setAllTickets = useSetRecoilState(allTicketsState)

    const handleUpdateApproval = (approval_level) => async () => {
        const newTicketData = {
            [approval_level]: !currentTicket[approval_level],
        }
        const payload = {
            ticket_data: newTicketData,
            approval_type: approval_level,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.PPR}/updateapprovals/${currentTicket._id}`,
            payload
        )
        await getAllTickets(setAllTickets)
    }

    return (
        <VStack>
            <Table mb="12px">
                <Tbody>
                    <TicketContentTableRow
                        heading={'Status'}
                        value={currentTicket.status}
                    />
                    <TicketContentTableRow
                        heading={'Cost'}
                        value={getFormattedCurrency(currentTicket.cost)}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Justification'}
                        value={currentTicket.purchase_justification}
                    />
                    <TicketContentTableRow
                        heading={'Purchase URL'}
                        value={currentTicket.purchase_url}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Order Number'}
                        value={currentTicket.po_number}
                    />
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        value={currentTicket.requisition_number}
                    />
                </Tbody>
            </Table>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Director Approval'}
                        value={
                            <Checkbox
                                disabled={!auth.isDirector}
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.director_approval
                                )}
                                isChecked={currentTicket.director_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Team Captain Approval'}
                        value={
                            <Checkbox
                                disabled={!auth.isTeamCaptain}
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.team_captain_approval
                                )}
                                isChecked={currentTicket.team_captain_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Faculty Advisor Approval'}
                        value={
                            <Checkbox
                                disabled={!auth.isAdmin}
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.admin_approval
                                )}
                                isChecked={currentTicket.admin_approval}
                            />
                        }
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default PPRContentTable
