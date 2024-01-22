import React from 'react'
import {
    FormHelperText,
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftAddon,
    Select,
    Flex,
    Textarea,
} from '@chakra-ui/react'
import { Select as SearchableSelect } from 'chakra-react-select'
import { Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './custom-datepicker.css'
import { ENDOWMENT_FUNDS } from '../constants'

const AVAILABLE_YEARS = [
    'Winter 2019',
    'Spring 2019',
    'Fall 2019',
    'Winter 2020',
    'Spring 2020',
    'Fall 2020',
    'Winter 2021',
    'Spring 2021',
    'Fall 2021',
    'Winter 2022',
    'Spring 2022',
    'Fall 2022',
    'Winter 2023',
    'Spring 2023',
    'Fall 2023',
    'Winter 2024',
    'Spring 2024',
    'Fall 2024',
    'Winter 2025',
    'Spring 2025',
    'Fall 2025',
]

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
                            {ENDOWMENT_FUNDS.map((fund) => (
                                <option value={fund} key={fund}>
                                    {fund}
                                </option>
                            ))}
                        </Select>
                    </Flex>
                    <Flex flexDir="column" w="50%">
                        <FormLabel>Semester </FormLabel>
                        <Select
                            id="semester"
                            placeholder="Select a semester"
                            {...register('semester', {
                                required: 'This is required',
                            })}
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
                    <InputLeftAddon>CAD $</InputLeftAddon>
                    <Input
                        id="funding_allocation"
                        h="1.95rem"
                        type="number"
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
                <FormLabel mt="10px">Proposal ID</FormLabel>
                <Input
                    id="proposal_id"
                    {...register('proposal_id')}
                    size="sm"
                />

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

export const FundingItemForm = ({ register, control, sfOptions }) => {
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
                    <InputLeftAddon>CAD $</InputLeftAddon>
                    <Input
                        id="funding_allocation"
                        h="1.95rem"
                        type="number"
                        {...register('funding_allocation', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Sponsorship Fund Link</FormLabel>
                <Controller
                    control={control}
                    name="sf_link"
                    rules={{ required: 'This is required' }}
                    render={({
                        field: { onChange, onBlur, value, name, ref },
                    }) => (
                        <SearchableSelect
                            size="sm"
                            name={name}
                            ref={ref}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            options={sfOptions}
                            placeholder=""
                        />
                    )}
                />
            </FormControl>

            <FormControl>
                <FormLabel mt="10px">Purchase Justification</FormLabel>
                <Textarea
                    id="purchase_justification"
                    {...register('purchase_justification')}
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

export const UWFinancePurchaseForm = ({ register, control, fiOptions }) => {
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
                    <InputLeftAddon>CAD $</InputLeftAddon>
                    <Input
                        id="cost"
                        h="1.95rem"
                        type="number"
                        {...register('cost', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Funding Item Link</FormLabel>
                <Controller
                    control={control}
                    name="fi_link"
                    rules={{ required: 'This is required' }}
                    render={({
                        field: { onChange, onBlur, value, name, ref },
                    }) => (
                        <SearchableSelect
                            size="sm"
                            name={name}
                            ref={ref}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            options={fiOptions}
                            placeholder=""
                        />
                    )}
                />

                <FormLabel mt="10px">Purchase URL </FormLabel>
                <Input
                    id="purchase_url"
                    {...register('purchase_url', {
                        required: 'This is required',
                    })}
                    size="sm"
                />

                <FormLabel mt="10px">Purchase Instructions </FormLabel>
                <Textarea
                    id="purchase_instructions"
                    {...register('purchase_instructions', {
                        required: 'This is required',
                    })}
                    size="sm"
                />
                <FormHelperText>
                    If there are any special instructions to purchase the item
                </FormHelperText>

                <FormLabel mt="10px">Purchase Justification</FormLabel>
                <Textarea
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
                <Textarea
                    id="pickup_instruction"
                    {...register('pickup_instruction')}
                    size="sm"
                />
            </FormControl>
        </>
    )
}

export const PersonalPurchaseForm = ({ register, control, fiOptions }) => {
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
                    <InputLeftAddon>CAD $</InputLeftAddon>
                    <Input
                        id="cost"
                        h="1.95rem"
                        type="number"
                        {...register('cost', {
                            required: 'This is required',
                        })}
                    />
                </InputGroup>

                <FormLabel mt="10px">Funding Item Link</FormLabel>
                <Controller
                    control={control}
                    name="fi_link"
                    rules={{ required: 'This is required' }}
                    render={({
                        field: { onChange, onBlur, value, name, ref },
                    }) => (
                        <SearchableSelect
                            size="sm"
                            name={name}
                            ref={ref}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            options={fiOptions}
                            placeholder=""
                        />
                    )}
                />

                <FormLabel mt="10px">Purchase URL </FormLabel>
                <Input
                    id="purchase_url"
                    {...register('purchase_url', {
                        required: 'This is required',
                    })}
                    size="sm"
                />

                <FormLabel mt="10px">Purchase Justification</FormLabel>
                <Textarea
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
