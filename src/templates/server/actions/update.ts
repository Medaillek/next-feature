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
import { update${capitalized}InDb } from '../../db/update'
import { queryUserPermissions } from '@/lib/utils.user'

export const update${capitalized}Action = authedProcedure
    .createServerAction()
    .input(update${capitalized}ActionSchema)
    .handler(async ({ input, ctx }) => {
        ${generateHasPermission('update', permissionType, featureName)}

        try {
            await update${capitalized}InDb(input)
        } catch (e) {
            console.error(e)
            throw 'Impossible de mettre à jour la ${featureName}.'
        }

        return ${featureName}Id
    })
`.trim()
}
