import { capitalize } from '../../../utils'

export const updateDbTemplate = (featureName: string, tableName: string) => {
	const capitalized = capitalize(featureName)
	return `
'server only'

import { createTransactionnalClient, db } from '@/drizzle/db'
import { Update${capitalized}ActionInput } from '../../schemas/server'
import { ${tableName} } from '@/drizzle/tables'
import { eq } from 'drizzle-orm'

export const update${capitalized}InDb = async (
    input: Update${capitalized}ActionInput
) => {
    const {
        // Add fields here
    } = input

    const db = createTransactionnalClient()
    const ${featureName}Id = await db.transaction(async (tx) => {
        const [{ ${featureName}Id }] = await tx
            .update(${tableName})
            .set({
                // Add fields here
            })
            .where(eq(${tableName}.${featureName}Id: input.${featureName}Id))
            .limit(1)
            .returning({
                ${featureName}Id: ${tableName}.${featureName}Id,
            })

        return ${featureName}Id
    })

    return ${featureName}Id
}

`.trim()
}
