# Next.Js feature based architecture builder

## Requirements

### Libraries

- next : ^15.1
- zsa : ^0.6.0
- zod : ^3.X.X
- zsa-react : ^0.2.3
- react-hook-form: ^7.X.X
- shadcn (optionnal)
- "drizzle-orm": "^0.39.3",
- "drizzle-zod": "^0.7.0",
- "eslint-plugin-drizzle": "^0.2.3",

### Files

`@/lib/zsa.ts`

```ts
'server only'

import { createServerActionProcedure } from 'zsa'
import { getUser } from '@/utils'

export const authedProcedure = createServerActionProcedure().handler(
	async () => {
		const user = await getUser()

		// check if user is authenticated else throw an error
		if (!user) {
			throw new Error('User not authenticated')
		}

		return { user }
	}
)
```

---

`@/drizzle/tables/{TABLE_NAME}.ts` -> update TABLE_NAME according to the feature name

```ts
import { serial, pgTable } from 'drizzle-orm/pg-core'

export const TABLE_NAME = pgTable('TABLE_NAME', {
	id: serial('id').notNull().primaryKey(),
	// other fields
})
```

---

`@/components/ui/StyledFormField.tsx` (optionnal)

```tsx
'use client'

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input as DefaultInput } from '@/components/ui/input'
import React from 'react'
import {
	Control,
	ControllerRenderProps,
	FieldValues,
	Path,
} from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Textarea } from './textarea'
import DatePicker from './date-picker'
import { Button } from '@/components/ui/button'
import { Switch } from './switch'

type StyledFormFieldClassNames = {
	label?: string
	description?: string
	item?: string
	input?: string
}

type InputType =
	| 'text'
	| 'password'
	| 'email'
	| 'number'
	| 'tel'
	| 'url'
	| 'textarea'
	| 'date'
	| 'boolean'
	| undefined

type StyledFormFieldProps<
	T extends Record<string, unknown>,
	IT extends InputType
> = {
	control: Control<T, unknown>
	name: keyof T
	onChange?: (value: unknown, field: ControllerRenderProps<T>) => void
	description?: React.ReactNode
	label?: React.ReactNode
	classNames?: StyledFormFieldClassNames
	children?: React.ReactNode
	inputType?: IT
	dateProps?: IT extends 'date'
		?
				| Omit<
						React.ComponentProps<typeof DatePicker>,
						'selectedDate' | 'setSelectedDate'
				  >
				| undefined
		: undefined
	render?: ({ field }: { field: ControllerRenderProps<T> }) => React.ReactNode
	showResetButton?: boolean
	placeholder?: string
	hideFormMessage?: boolean
	disabled?: boolean
	required?: boolean
	defaultValue?: string
	autoComplete?: string
	id?: string
	autoFocus?: boolean
	handleReset?: () => void
}

function StyledFormField<T extends FieldValues, IT extends InputType>({
	render,
	classNames,
	hideFormMessage,
	defaultValue,
	inputType = 'text',
	autoComplete = 'off',
	id,
	autoFocus,
	placeholder,
	required,
	label,
	description,
	disabled,
	showResetButton,
	onChange,
	handleReset,
	...props
}: StyledFormFieldProps<T, IT>) {
	const Input = inputType === 'textarea' ? Textarea : DefaultInput

	return (
		<FormField
			name={props.name as Path<T>}
			control={props.control}
			shouldUnregister
			render={({ field }) => {
				return (
					<FormItem className={cn('w-full spacey1', classNames?.item)}>
						{label && (
							<FormLabel
								className={cn(
									'text-sm relative font-semibold text-ring',
									classNames?.label
								)}
								htmlFor={field.name}
							>
								{label}
								{required && <span className="ml-1 text-red-500">*</span>}
							</FormLabel>
						)}
						{description && (
							<FormDescription
								className={cn('text-xs pb-1', classNames?.description)}
							>
								{description}
							</FormDescription>
						)}
						{inputType === 'date' && !render && (
							<DatePicker
								setSelectedDate={(date) => {
									if (onChange) {
										onChange(date, field)
									}
									field.onChange(date)
								}}
								isForm={true}
								{...props.dateProps}
								ref={field.ref}
								disabled={field.disabled}
								id={id ?? (field.name as string)}
								selectedDate={field.value}
							/>
						)}
						{render && <>{render({ field })}</>}
						{!render && inputType !== 'date' && (
							<FormControl>
								{inputType === 'boolean' ? (
									<Switch
										ref={field.ref}
										className="block"
										checked={field.value as boolean}
										onCheckedChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										id={field.name}
									/>
								) : (
									<Input
										{...field}
										defaultValue={defaultValue}
										value={field.value ?? ''}
										className={cn(
											'text-sm w-full placeholder:text-primary/40',
											classNames?.input
										)}
										id={id ?? (field.name as string)}
										type={inputType}
										disabled={disabled}
										placeholder={placeholder}
										autoComplete={autoComplete}
										autoFocus={autoFocus}
									/>
								)}
							</FormControl>
						)}
						{(showResetButton || handleReset) && (
							<div className="flex justify-end">
								<Button
									type="button"
									variant={'link'}
									size={'unstyled'}
									disabled={disabled}
									onClick={() =>
										handleReset ? handleReset() : field.onChange(null)
									}
									className="h-6 text-xs"
									tabIndex={-1}
								>
									Réinitialiser ce champs
								</Button>
							</div>
						)}
						{!hideFormMessage && <FormMessage />}
					</FormItem>
				)
			}}
		/>
	)
}

export default StyledFormField
```

---

## How to use ?

`npx next-feature`
-> What is the path of the feature folder?
-> What is the name of the feature?
-> What is the permission type? : `'factoryId' | 'zoneId'`
-> What is the name of the table to use?
-> Are you sure you want to create this feature?
