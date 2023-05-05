import React from 'react'
import {
    FormHelperText,
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    Select,
} from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './custom-datepicker.css'

const AVAILABLE_YEARS = ['19', '20', '21', '22', '23', '24', '25']
const ENDOWMENT_FUNDS = {
    MEF: 'MEF',
    WEEF: 'WEEF',
    ENGSOC: 'EngSoc',
    DEAN_OF_ENG: 'Dean of Eng',
}
export const SponsorshipFundForm = ({ register, control }) => {
    return (
        <>
            <FormControl isRequired>
                <FormLabel>Organization</FormLabel>
                <Select
                    id="organization"
                    {...register('organization', {
                        required: 'This is required',
                    })}
                    size="sm"
                >
                    {Object.keys(ENDOWMENT_FUNDS).map((fund) => (
                        <option value={fund} key={fund}>
                            {ENDOWMENT_FUNDS[fund]}
                        </option>
                    ))}
                </Select>
                <FormLabel>Semester </FormLabel>
                <Select id="semester" {...register('semester')} size="sm">
                    {AVAILABLE_YEARS.map((year) => {
                        return (
                            <>
                                <option value={`W${year}`} key={`W${year}`}>
                                    W{year}
                                </option>
                                <option value={`S${year}`} key={`S${year}`}>
                                    S{year}
                                </option>
                                <option value={`F${year}`} key={`F${year}`}>
                                    F{year}
                                </option>
                            </>
                        )
                    })}
                </Select>
                <FormLabel>Funding Allocation</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="$" />
                    <Input
                        id="funding_allocation"
                        {...register('funding_allocation', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>
                <FormLabel>Claim Deadline</FormLabel>

                <Controller
                    control={control}
                    name="claim_deadline"
                    render={({ field }) => (
                        <DatePicker
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            className="custom-date-picker"
                        />
                    )}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Proposal URL</FormLabel>

                <Input
                    id="proposal_url"
                    {...register('proposal_url')}
                    size="sm"
                />
                <FormLabel>Presentation URL</FormLabel>
                <Input
                    id="presentation_url"
                    {...register('presentation_url')}
                    size="sm"
                />
            </FormControl>
        </>
    )
}

export const FundingItemForm = ({ register }) => {
    return (
        <>
            <FormControl isRequired>
                <FormLabel>Funding Item Name</FormLabel>
                <Input
                    id="name"
                    {...register('name', {
                        required: 'This is required',
                    })}
                    size="sm"
                />
                <FormLabel>Parent Sponsorship Fund </FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="SF-" />
                    <Input id="sf_link" {...register('sf_link')} />
                </InputGroup>

                <FormLabel>Funding Allocation</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="$" />
                    <Input
                        id="funding_allocation"
                        {...register('funding_allocation', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>
            </FormControl>

            <FormControl>
                <FormLabel>Purchase Justification</FormLabel>
                <Input
                    id="purchase_justification"
                    {...register('purchase_justification', {
                        required: 'This is required',
                    })}
                    size="sm"
                />
                <FormHelperText>
                    There should be enough justification such that our faculty
                    advisor and financial coordinator can approve it.
                </FormHelperText>
            </FormControl>
        </>
    )
}

export const UWFinancePurchaseForm = ({ register }) => {
    return (
        <>
            <FormControl isRequired>
                <FormLabel>UW Finance Purchase Item Name</FormLabel>
                <Input
                    id="name"
                    {...register('name', {
                        required: 'This is required',
                    })}
                />
                <FormLabel>Funding Item Link</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="FI-" />
                    <Input
                        id="fi_link"
                        {...register('fi_link', {
                            required: 'This is required',
                        })}
                        size="sm"
                    />
                </InputGroup>
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
                    If there are any special instructions to purchase the item
                </FormHelperText>

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
            </FormControl>
            <FormControl>
                <FormLabel>Pickup Instructions </FormLabel>
                <Input
                    id="pickup_instruction"
                    {...register('pickup_instruction')}
                />
            </FormControl>
        </>
    )
}

export const PersonalPurchaseForm = ({ register }) => {
    return (
        <>
            <FormControl isRequired>
                <FormLabel>Personal Purchase Item Name</FormLabel>
                <Input
                    id="name"
                    {...register('name', {
                        required: 'This is required',
                    })}
                    size="sm"
                />
                <FormLabel>Funding Item Link</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="FI-" />
                    <Input
                        id="fi_link"
                        {...register('fi_link', {
                            required: 'This is required',
                        })}
                        size="sm"
                    />
                </InputGroup>
                <FormLabel>Purchase URL </FormLabel>
                <Input
                    id="purchase_url"
                    {...register('purchase_url', {
                        required: 'This is required',
                    })}
                    size="sm"
                />

                <FormLabel>Cost</FormLabel>
                <InputGroup size="sm">
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
                    size="sm"
                />
                <FormHelperText>
                    There should be enough justification such that our faculty
                    advisor and financial coordinator can approve it.
                </FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Pickup Instructions </FormLabel>
                <Input
                    id="pickup_instruction"
                    {...register('pickup_instruction')}
                    size="sm"
                />
            </FormControl>
        </>
    )
}
