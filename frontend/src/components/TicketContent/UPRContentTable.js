import { Checkbox, Table, Tbody, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { getFormattedCurrency } from '../../utils/utils'
import TicketContentTableRow from './TicketContentTableRow'
import { useAuth } from '../../contexts/AuthContext'
import { axiosPreset } from '../../axiosConfig'
import {
    TICKET_ENDPOINTS,
    APPROVAL_LEVELS,
    SEEKING_APPROVAL_STATUS,
} from '../../constants'
import { useSetRecoilState } from 'recoil'
import { allTicketsState } from '../../state/atoms'
import { getAllTickets } from '../../utils/globalSetters'
import { useGetCurrentTicket } from '../../hooks/hooks'

const UPRContentTable = () => {
    const auth = useAuth()
    const currentTicket = useGetCurrentTicket()
    const setAllTickets = useSetRecoilState(allTicketsState)
    const [loading, setLoading] = useState(false)

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
        }
        try {
            setLoading(true)
            await axiosPreset.patch(
                `${TICKET_ENDPOINTS.UPR}/updateapprovals/${currentTicket._id}`,
                payload
            )
            await getAllTickets(setAllTickets)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const statusToStatusText = {
        SEEKING_APPROVAL: 'Seeking Approval',
        SENT_TO_COORDINATOR: 'Sent to Coordinator',
        ORDERED: 'Ordered',
        READY_FOR_PICKUP: 'Ready for Pickup',
        PICKED_UP: 'Picked up',
    }

    const statusToNextStatusText = {
        SEEKING_APPROVAL: 'Sent to Coordinator',
        SENT_TO_COORDINATOR: 'Ordered',
        ORDERED: 'Ready for Pickup',
        READY_FOR_PICKUP: 'Picked up',
        PICKED_UP: 'N/A',
    }

    return (
        <VStack>
            <Table mb="12px">
                <Tbody>
                    <TicketContentTableRow
                        heading={'Status'}
                        value={statusToStatusText[currentTicket.status]}
                    />
                    <TicketContentTableRow
                        heading={'Next Status'}
                        value={statusToNextStatusText[currentTicket.status]}
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
                        type="URL"
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
                        heading={'Finance/Admin Approval'}
                        value={
                            <Checkbox
                                borderColor="wato.grey"
                                disabled={
                                    !auth.isAdmin ||
                                    currentTicket.status !==
                                        SEEKING_APPROVAL_STATUS ||
                                    loading
                                }
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.admin_approval
                                )}
                                isChecked={currentTicket.admin_approval}
                            />
                        }
                    />
                    <TicketContentTableRow
                        heading={'Faculty Advisor Approval'}
                        value={
                            <Checkbox
                                borderColor="wato.grey"
                                disabled={
                                    !auth.isAdmin ||
                                    currentTicket.status !==
                                        SEEKING_APPROVAL_STATUS ||
                                    loading
                                }
                                onChange={handleUpdateApproval(
                                    APPROVAL_LEVELS.faculty_advisor_approval
                                )}
                                isChecked={
                                    currentTicket.faculty_advisor_approval
                                }
                            />
                        }
                    />
                </Tbody>
            </Table>
        </VStack>
    )
}

export default UPRContentTable
