import { PermissionType } from '../../../data'
import { capitalize, generateHasPermission } from '../../../utils'

export const deleteActionTemplate = (
	featureName: string,
	permissionType: PermissionType
) => {
	const capitalized = capitalize(featureName)

	return `
'use server'

import { queryUserPermissions } from '@/lib/utils.user'
import { authedProcedure } from '@/lib/zsa'
import { delete${capitalized}ActionSchema } from '../../schemas/server'

export const delete${capitalized}Action = authedProcedure
	.createServerAction()
	.input(delete${capitalized}ActionSchema)
	.handler(async ({ input, ctx }) => {
       ${generateHasPermission('delete', permissionType, featureName)}
	})
`.trim()
}
