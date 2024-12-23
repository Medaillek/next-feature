import { capitalize, DataErrorResults, makeFile } from '../../utils'

const typesTemplate = (featureName: string) => {
	const capitalized = capitalize(featureName)
	return `
import { z } from 'zod'
import {
	create${capitalized}FormSchema,
	delete${capitalized}FormSchema,
	update${capitalized}FormSchema,
} from './schemas/client'
import { type UserPermissions } from '@/data/role'
import {
	create${capitalized}DbSchema,
	update${capitalized}DbSchema,
	delete${capitalized}ActionSchema,
	select${capitalized}Schema,
} from './schemas/server'

export type ${capitalized}WithPermissions = ${capitalized} & {
	permissions: UserPermissions
}

export type Create${capitalized}DbInput = z.infer<typeof create${capitalized}DbSchema>
export type Update${capitalized}DbInput = z.infer<typeof update${capitalized}DbSchema>

export type ${capitalized} = z.infer<typeof select${capitalized}Schema>

export type Create${capitalized}FormInput = z.infer<typeof create${capitalized}FormSchema>
export type Update${capitalized}FormInput = z.infer<typeof update${capitalized}FormSchema>
export type Delete${capitalized}FormInput = z.infer<typeof delete${capitalized}FormSchema>

export type Delete${capitalized}ActionInput = z.infer<
	typeof delete${capitalized}ActionSchema
>
`.trim()
}

export async function makeTypesFile(featureName: string, featurePath: string) {
	const typesFileResult = await makeFile(
		featurePath + `/${featureName}.types.ts`,
		typesTemplate(featureName)
	)

	if (typesFileResult.error) {
		throw new DataErrorResults(
			[typesFileResult],
			featurePath,
			'Failed to create types file'
		)
	}
}
