import { capitalize } from '../../utils'

export const serverSchemasTemplate = (
	featureName: string,
	tableName: string
) => {
	const capitalized = capitalize(featureName)

	return `
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ${tableName} } from '@/drizzle/tables'
import { removeNullable, zodUuid } from '@/lib/common.zod'

export const ${featureName}BaseSchema = createInsertSchema(${tableName}, {

}).omit({

})

export const create${capitalized}ActionSchema = ${featureName}BaseSchema.required({

})

export const update${capitalized}ActionSchema = ${featureName}BaseSchema
    .omit({
        
    })
    .required({
        ${featureName}Id: true,
    })

export const delete${capitalized}ActionSchema = ${featureName}BaseSchema
    .pick({ ${featureName}Id: true })
    .required({ ${featureName}Id: true })


export const create${capitalized}DbSchema = removeNullable(
	create${capitalized}ActionSchema.required({

    }),
	{ 

    }
)

export const update${capitalized}DbSchema = removeNullable(
    update${capitalized}ActionSchema.required({

    }),
    { 

    }
)

export const select${capitalized}Schema = createSelectSchema(${tableName})`.trim()
}
