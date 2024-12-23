import { capitalize } from '../../utils'

export const clientSchemasTemplate = (featureName: string) => {
	const capitalized = capitalize(featureName)

	return `
import { z } from 'zod'
import { create${capitalized}ActionSchema, update${capitalized}ActionSchema } from '../server'

export const create${capitalized}FormSchema = create${capitalized}ActionSchema
	.omit({

	})

export const update${capitalized}FormSchema = update${capitalized}ActionSchema
	.omit({

	})

export const delete${capitalized}FormSchema = z.object({
	confirm: z
		.string({
			message: \`Vous devez écrire "supprimer" pour confirmer la suppression\`,
		})
		.regex(/supprimer/, {
			message: \`Vous devez écrire "supprimer" pour confirmer la suppression\`,
		}),
})`.trim()
}
