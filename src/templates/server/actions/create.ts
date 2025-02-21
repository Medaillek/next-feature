import { PermissionType } from '../../../data'
import { capitalize, generateHasPermission } from '../../../utils'

export const createActionTemplate = (
	featureName: string,
	permissionType: PermissionType
) => {
	const capitalized = capitalize(featureName)
	return `
'use server'

import { authedProcedure } from '@/lib/zsa'
import { create${capitalized}ActionSchema } from '../../schemas/server'
import { insert${capitalized}InDb } from '../../db/create'
import { queryUserPermissions } from '@/lib/utils.user'


export const create${capitalized}Action = authedProcedure
	.createServerAction()
	.input(create${capitalized}ActionSchema)
	.handler(async ({ input, ctx }) => {
        ${generateHasPermission('create', permissionType, featureName)}

		let ${featureName}Id: number

		try {
			${featureName}Id = await insert${capitalized}InDb(input)
		} catch (e) {
			console.error(e)
			throw 'Impossible de créer la ${featureName}.'
		}

		return { ${featureName}Id }
	})
`.trim()
}
