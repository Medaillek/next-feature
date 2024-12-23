import { createActionTemplate as cat } from './create'
import { deleteActionTemplate as dat } from './delete'
import { updateActionTemplate as uat } from './update'

import { DataError, makeFile } from '../../../utils'
import { PermissionType } from '../../../data'

function indexTemplate() {
	return `
    export * from './create'
    export * from './delete'
    export * from './update'
   `.trim()
}

export function makeActionDir(
	featureName: string,
	permissionType: PermissionType,
	path: string
): Promise<DataError<string>[]> {
	const createActionTemplate = cat(featureName, permissionType)
	const deleteActionTemplate = dat(featureName, permissionType)
	const updateActionTemplate = uat(featureName, permissionType)
	const indexFile = indexTemplate()

	const createPath = `${path}/create.ts`
	const deletePath = `${path}/delete.ts`
	const updatePath = `${path}/update.ts`
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
