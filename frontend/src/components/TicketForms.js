import React from 'react'
import {
    FormHelperText,
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    Select,
    Flex,
} from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './custom-datepicker.css'

const AVAILABLE_YEARS = [
    'W19',
    'S19',
    'F19',
    'W20',
    'S20',
    'F20',
    'W21',
    'S21',
    'F21',
    'W22',
    'S22',
    'F22',
    'W23',
    'S23',
    'F23',
    'W24',
    'S24',
    'F24',
    'W25',
    'S25',
    'F25',
]

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
                <Flex flexDir="row" justifyContent="center" gap="10%">
                    <Flex flexDir="column" w="50%">
                        <FormLabel>Organization</FormLabel>
                        <Select
                            id="organization"
                            placeholder="Select an organization"
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
                    </Flex>
                    <Flex flexDir="column" w="50%">
                        <FormLabel>Semester </FormLabel>
                        <Select
                            id="semester"
                            placeholder="Select a semester"
                            {...register('semester')}
                            size="sm"
                        >
                            {AVAILABLE_YEARS.map((year) => {
                                return (
                                    <option value={year} key={year}>
                                        {year}
                                    </option>
                                )
                            })}
                        </Select>
                    </Flex>
                </Flex>

                <FormLabel mt="10px">Funding Allocation</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="$" />
                    <Input
                        id="funding_allocation"
                        h="1.95rem"
                        pl="24px"
                        {...register('funding_allocation', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Claim Deadline</FormLabel>
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
                <FormLabel mt="10px">Proposal URL</FormLabel>
                <Input
                    id="proposal_url"
                    {...register('proposal_url')}
                    size="sm"
                />

                <FormLabel mt="10px">Presentation URL</FormLabel>
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

                <FormLabel mt="10px">Funding Allocation</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="$" />
                    <Input
                        id="funding_allocation"
                        h="1.95rem"
                        pl="24px"
                        {...register('funding_allocation', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Parent Sponsorship Fund </FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement justifyContent="right" children="SF-" />
                    <Input h="1.95rem" id="sf_link" {...register('sf_link')} />
                </InputGroup>
            </FormControl>

            <FormControl>
                <FormLabel mt="10px">Purchase Justification</FormLabel>
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
                    size="sm"
                />

                <FormLabel mt="10px">Cost</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="$" />
                    <Input
                        id="cost"
                        h="1.95rem"
                        pl="24px"
                        {...register('cost', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Funding Item Link</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement justifyContent="right" children="FI-" />
                    <Input
                        id="fi_link"
                        h="1.95rem"
                        {...register('fi_link', {
                            required: 'This is required',
                        })}
                        size="sm"
                    />
                </InputGroup>

                <FormLabel mt="10px">Purchase URL </FormLabel>
                <Input
                    id="purchase_url"
                    {...register('purchase_url', {
                        required: 'This is required',
                    })}
                    size="sm"
                />

                <FormLabel mt="10px">Purchase Instructions </FormLabel>
                <Input
                    id="purchase_instructions"
                    {...register('purchase_instructions')}
                    size="sm"
                />
                <FormHelperText>
                    If there are any special instructions to purchase the item
                </FormHelperText>

                <FormLabel mt="10px">Purchase Justification</FormLabel>
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
                <FormLabel mt="10px">Pickup Instructions </FormLabel>
                <Input
                    id="pickup_instruction"
                    {...register('pickup_instruction')}
                    size="sm"
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

                <FormLabel mt="10px">Cost</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement children="$" />
                    <Input
                        id="cost"
                        h="1.95rem"
                        pl="24px"
                        {...register('cost', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Funding Item Link</FormLabel>
                <InputGroup size="sm">
                    <InputLeftElement justifyContent="right" children="FI-" />
                    <Input
                        id="fi_link"
                        h="1.95rem"
                        {...register('fi_link', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Purchase URL </FormLabel>
                <Input
                    id="purchase_url"
                    {...register('purchase_url', {
                        required: 'This is required',
                    })}
                    size="sm"
                />

                <FormLabel mt="10px">Purchase Justification</FormLabel>
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
