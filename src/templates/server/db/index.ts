import { DataError, makeFile } from '../../../utils'
import { createDbTemplate as cdt } from './create'
import { updateDbTemplate as udt } from './update'

function makeIndexFile() {
	return `
    export * from './create'
    export * from './delete'
    export * from './update'
    export * from './select'
   `.trim()
}

export function makeDbDir(
	path: string,
	tableName: string,
	featureName: string
): Promise<DataError<string>[]> {
	const indexFile = makeIndexFile()
	const createDbTemplate = cdt(featureName, tableName)
	const updateDbTemplate = udt(featureName, tableName)

	const createPath = `${path}/create.ts`
	const deletePath = `${path}/delete.ts`
	const updatePath = `${path}/update.ts`
	const selectPath = `${path}/select.ts`
	const indexPath = `${path}/index.ts`

	const createFileProm = makeFile(createPath, createDbTemplate)
	const deleteFileProm = makeFile(deletePath, '')
	const updateFileProm = makeFile(updatePath, updateDbTemplate)
	const selectFileProm = makeFile(selectPath, '')
	const indexFileProm = makeFile(indexPath, indexFile)

	return Promise.all([
		createFileProm,
		deleteFileProm,
		selectFileProm,
		updateFileProm,
		indexFileProm,
	])
}
