import { createActionTemplate as cat } from './create'
import { deleteActionTemplate as dat } from './delete'
import { updateActionTemplate as uat } from './update'

import { capitalize, DataError, makeFile } from '../../../utils'
import { PermissionType } from '../../../data'

function indexTemplate(featureName: string): string {
	return `
    export * from './create${featureName}Action'
    export * from './delete${featureName}Action'
    export * from './update${featureName}Action'
   `.trim()
}

export function makeActionDir(
	featureName: string,
	permissionType: PermissionType,
	path: string
): Promise<DataError<string>[]> {
	const capitalized = capitalize(featureName)
	const createActionTemplate = cat(featureName, permissionType)
	const deleteActionTemplate = dat(featureName, permissionType)
	const updateActionTemplate = uat(featureName, permissionType)
	const indexFile = indexTemplate(capitalized)

	const createPath = `${path}/create${capitalized}Action.ts`
	const deletePath = `${path}/delete${capitalized}Action.ts`
	const updatePath = `${path}/update${capitalized}Action.ts`
	const indexPath = `${path}/index.ts`

	const createFileProm = makeFile(createPath, createActionTemplate)
	const deleteFileProm = makeFile(deletePath, deleteActionTemplate)
	const updateFileProm = makeFile(updatePath, updateActionTemplate)
	const indexFileProm = makeFile(indexPath, indexFile)

	return Promise.all([
		createFileProm,
		deleteFileProm,
		updateFileProm,
		indexFileProm,
	])
}
