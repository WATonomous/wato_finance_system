import React from 'react'
import {
    FormHelperText,
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react'

export const SponsorshipFundForm = ({ register }) => {
    return (
        <FormControl>
            <FormLabel>Organization</FormLabel>
            <Input
                id="organization"
                {...register('organization', {
                    required: 'This is required',
                })}
            />
            <FormLabel>Semester </FormLabel>
            <Input id="semester" {...register('semester')} />
            <FormLabel>Funding Allocation</FormLabel>
            <InputGroup>
                <InputLeftElement children="$" />
                <Input
                    id="funding_allocation"
                    {...register('funding_allocation', {
                        required: 'This is required',
                    })}
                />
            </InputGroup>
            <FormLabel>Proposal URL</FormLabel>
            <Input
                id="proposal_url"
                {...register('proposal_url', {
                    required: 'This is required',
                })}
            />
            <FormLabel>Presentation URL</FormLabel>
            <Input
                id="presentation_url"
                {...register('presentation_url', {
                    required: 'This is required',
                })}
            />
            <FormLabel>Claim Deadline</FormLabel>
            <Input
                id="claim_deadline"
                {...register('claim_deadline', {
                    required: 'This is required',
                })}
            />
        </FormControl>
    )
}

export const FundingItemForm = ({ register }) => {
    return (
        <FormControl>
            <FormLabel>Funding Item Name</FormLabel>
            <Input
                id="name"
                {...register('name', {
                    required: 'This is required',
                    minLength: {
                        value: 4,
                        message: 'Minimum length should be 4',
                    },
                })}
            />
            <FormLabel>Parent Sponsorship Fund </FormLabel>
            <Input id="sf_link" {...register('sf_link')} />

            <FormLabel>Funding Allocation</FormLabel>
            <InputGroup>
                <InputLeftElement children="$" />
                <Input
                    id="funding_allocation"
                    {...register('funding_allocation', {
                        required: 'This is required',
                    })}
                />
            </InputGroup>
            <FormLabel>Purchase Justification</FormLabel>
            <Input
                id="purchase_justification"
                {...register('purchase_justification', {
                    required: 'This is required',
                })}
            />
            <FormHelperText>
                There should be enough justification such that our faculty
                advisor and financial coordinator can approve it.
            </FormHelperText>
        </FormControl>
    )
}

export const UWFinancePurchaseForm = ({ register }) => {
    return (
        <FormControl>
            <FormLabel>UW Finance Purchase Item Name</FormLabel>
            <Input
                id="name"
                {...register('name', {
                    required: 'This is required',
                })}
            />
            <FormLabel>Funding Item Link</FormLabel>
            <Input
                id="fi_link"
                {...register('fi_link', {
                    required: 'This is required',
                })}
            />
            <FormLabel>Purchase URL </FormLabel>
            <Input
                id="purchase_url"
                {...register('purchase_url', {
                    required: 'This is required',
                })}
            />

            <FormLabel>Purchase Instructions </FormLabel>
            <Input
                id="purchase_instructions"
                {...register('purchase_instructions')}
            />
            <FormHelperText>
                Please enter this field if there are any special instructions to
                purchase the item
            </FormHelperText>

            <FormLabel>Pickup Instructions </FormLabel>
            <Input
                id="pickup_instruction"
                {...register('pickup_instruction')}
            />

            <FormLabel>Cost</FormLabel>
            <InputGroup>
                <InputLeftElement children="$" />
                <Input
                    id="cost"
                    {...register('cost', {
                        required: 'This is required',
                    })}
                />
            </InputGroup>
            <FormLabel>Purchase Justification</FormLabel>
            <Input
                id="purchase_justification"
                {...register('purchase_justification', {
                    required: 'This is required',
                })}
            />
            <FormHelperText>
                There should be enough justification such that our faculty
                advisor and financial coordinator can approve it.
            </FormHelperText>
            <FormLabel>Requisition Number</FormLabel>
            <Input
                id="requisition_number"
                {...register('requisition_number')}
            />
            <FormHelperText>
                For UW Finance use only, you probably do not need to touch this
                field.
            </FormHelperText>

            <FormLabel>PO Number</FormLabel>
            <Input id="po_number" {...register('po_number')} />
            <FormHelperText>
                For UW Finance use only, you probably do not need to touch this
                field.
            </FormHelperText>
        </FormControl>
    )
}

export const PersonalPurchaseForm = ({ register }) => {
    return (
        <FormControl>
            <FormLabel>Personal Purchase Item Name</FormLabel>
            <Input
                id="name"
                {...register('name', {
                    required: 'This is required',
                })}
            />
            <FormLabel>Funding Item Link</FormLabel>
            <Input
                id="fi_link"
                {...register('fi_link', {
                    required: 'This is required',
                })}
            />
            <FormLabel>Purchase URL </FormLabel>
            <Input
                id="purchase_url"
                {...register('purchase_url', {
                    required: 'This is required',
                })}
            />

            <FormLabel>Pickup Instructions </FormLabel>
            <Input
                id="pickup_instruction"
                {...register('pickup_instruction')}
            />

            <FormLabel>Cost</FormLabel>
            <InputGroup>
                <InputLeftElement children="$" />
                <Input
                    id="cost"
                    {...register('cost', {
                        required: 'This is required',
                    })}
                />
            </InputGroup>
            <FormLabel>Purchase Justification</FormLabel>
            <Input
                id="purchase_justification"
                {...register('purchase_justification', {
                    required: 'This is required',
                })}
            />
            <FormHelperText>
                There should be enough justification such that our faculty
                advisor and financial coordinator can approve it.
            </FormHelperText>
            <FormLabel>Requisition Number</FormLabel>
            <Input
                id="requisition_number"
                {...register('requisition_number')}
            />
            <FormHelperText>
                For UW Finance use only, you probably do not need to touch this
                field.
            </FormHelperText>

            <FormLabel>PO Number</FormLabel>
            <Input id="po_number" {...register('po_number')} />
            <FormHelperText>
                For UW Finance use only, you probably do not need to touch this
                field.
            </FormHelperText>
        </FormControl>
    )
}
