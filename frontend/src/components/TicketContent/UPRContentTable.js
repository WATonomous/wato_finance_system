import { Checkbox, Table, Tbody, VStack } from '@chakra-ui/react'
import React from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { useAuth } from '../../contexts/AuthContext'
import { axiosPreset } from '../../axiosConfig'
import {
    TICKET_ENDPOINTS,
    APPROVAL_LEVELS,
    SEEKING_APPROVAL_STATUS,
} from '../../constants'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { allTicketsState, currentTicketState } from '../../state/atoms'
import { getAllTickets } from '../../utils/globalSetters'

const UPRContentTable = () => {
    const auth = useAuth()
    const currentTicket = useRecoilValue(currentTicketState)
    const setAllTickets = useSetRecoilState(allTicketsState)

    const handleUpdateApproval = (currentApprovalType) => async () => {
        const newApprovalLevels = {}

        Object.values(APPROVAL_LEVELS).forEach((approval_level) => {
            newApprovalLevels[approval_level] =
                approval_level === currentApprovalType
                    ? !currentTicket[approval_level]
                    : currentTicket[approval_level]
        })

        const payload = {
            new_approval_levels: newApprovalLevels,
            approval_type: currentApprovalType,
        }
        await axiosPreset.patch(
            `${TICKET_ENDPOINTS.UPR}/updateapprovals/${currentTicket._id}`,
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
                        heading={'Purchase Instructions'}
                        value={currentTicket.purchase_instructions}
                    />
                    <TicketContentTableRow
                        heading={'Purchase Order Number'}
                        value={currentTicket.po_number}
                    />
                    <TicketContentTableRow
                        heading={'Requisition Number'}
                        value={currentTicket.requisition_number}
                    />
                    <TicketContentTableRow
                        heading={'Pick-up Instructions'}
                        value={currentTicket.pickup_instruction}
                    />
                </Tbody>
            </Table>
            <Table>
                <Tbody>
                    <TicketContentTableRow
                        heading={'Director Approval'}
                        value={
                            <Checkbox
                                disabled={
                                    !auth.isDirector ||
                                    currentTicket.status !==
                                        SEEKING_APPROVAL_STATUS
                                }
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
                                disabled={
                                    !auth.isTeamCaptain ||
                                    currentTicket.status !==
                                        SEEKING_APPROVAL_STATUS
                                }
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
                                disabled={
                                    !auth.isAdmin ||
                                    currentTicket.status !==
                                        SEEKING_APPROVAL_STATUS
                                }
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

export default UPRContentTable
