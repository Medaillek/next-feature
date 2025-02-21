import { capitalize } from '../../../utils'

export const createDbTemplate = (featureName: string, tableName: string) => {
	const capitalized = capitalize(featureName)
	return `
'server only'

import { createTransactionnalClient, db } from '@/drizzle/db'
import { Create${capitalized}ActionInput } from '../../schemas/server'
import { ${tableName} } from '@/drizzle/tables'

export const insert${capitalized}InDb = async (
	input: Create${capitalized}ActionInput
) => {
	const {
        // Add fields here
	} = input

	const db = createTransactionnalClient()
	const ${featureName}Id = await db.transaction(async (tx) => {
		const [{ ${featureName}Id }] = await tx
			.insert(${tableName})
			.values({
				// Add fields here
			})
			.returning({
				${featureName}Id: ${tableName}.${featureName}Id,
			})

        return ${featureName}Id
	})

	return ${featureName}Id
}

`.trim()
}
