import { PermissionType } from '../../../data'
import { capitalize, generateHasPermission } from '../../../utils'

export const updateActionTemplate = (
	featureName: string,
	permissionType: PermissionType
) => {
	const capitalized = capitalize(featureName)
	return `
'use server'

import { authedProcedure } from '@/lib/zsa'
import { update${capitalized}ActionSchema } from '../../schemas/server'
import { queryUserPermissions } from '@/lib/utils.user'

export const update${capitalized}Action = authedProcedure
    .createServerAction()
    .input(update${capitalized}ActionSchema)
    .handler(async ({ input, ctx }) => {
        ${generateHasPermission('update', permissionType, featureName)}
    })
`.trim()
}
