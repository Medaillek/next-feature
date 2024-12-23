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
import { queryUserPermissions } from '@/lib/utils.user'

export const create${capitalized}Action = authedProcedure
	.createServerAction()
	.input(create${capitalized}ActionSchema)
	.handler(async ({ input, ctx }) => {
        ${generateHasPermission('create', permissionType, featureName)}
	})
`.trim()
}
