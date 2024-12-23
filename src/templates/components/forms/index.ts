import { capitalize, type CrudOperation } from '../../../utils'

export function buildFormTemplate(featureName: string, crud: CrudOperation) {
	const capitalized = capitalize(featureName)
	const capCrud = capitalize(crud as string)
	return `
'use client'

import React from 'react'
import { useServerAction } from 'zsa-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'

import StyledFormField from '@/components/ui/StyledFormField'
import { ${crud}${capitalized}Action } from '@/features/zone/server/actions'
import { ${capCrud}${capitalized}FormInput } from '../../types'
import { ${crud}${capitalized}FormSchema } from '../../schemas/form'

type ${capCrud}${capitalized}FormProps = {
	
}

export const ${capCrud}${capitalized}Form = ({  }: ${capCrud}${capitalized}FormProps) => {
	const { execute, isPending, isSuccess } = useServerAction(${crud}${capitalized}Action)

	const form = useForm<${capCrud}${capitalized}FormInput>({
		resolver: zodResolver(${crud}${capitalized}FormSchema),
		defaultValues: {

		},
	})

	async function onSubmit(values: ${capCrud}${capitalized}FormInput) {
		const [, err] = await execute({
			...values,
			
		})

		if (err) {
			toast.error(err.message)
			return
		}
		
		form.reset()
	}
	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full px-2"
				>
					<div className="space-y-4">
						<StyledFormField<${capCrud}${capitalized}FormInput>
							control={form.control}
							name=""
							autoFocus
							autoComplete="off"
							required
						/>
					</div>			
					<Separator className="my-4 md:mt-8" />
					<LoadingButton
						loading={isPending || isSuccess}
						type="submit"
						variant={'success'}
						disabled={
							form.formState.isSubmitting ||
							!form.formState.isValid ||
							isSuccess
						}
						className="mx-auto flex w-full"
					>
						Enregistrer
					</LoadingButton>
				</form>
			</Form>
		</>
	)
}

`.trim()
}
