import { capitalize, DataError, makeFile } from '../../../utils'
import { createDbTemplate as cdt } from './create'
import { updateDbTemplate as udt } from './update'

function makeIndexFile(featureName: string) {
	return `
    export * from './create${featureName}InDb'
    export * from './delete${featureName}InDb'
    export * from './update${featureName}InDb'
    export * from './select'
   `.trim()
}

export function makeDbDir(
	path: string,
	tableName: string,
	featureName: string
): Promise<DataError<string>[]> {
	const capitalized = capitalize(featureName)
	const indexFile = makeIndexFile(capitalized)
	const createDbTemplate = cdt(featureName, tableName)
	const updateDbTemplate = udt(featureName, tableName)

	const createPath = `${path}/create${capitalized}InDb.ts`
	const deletePath = `${path}/delete${capitalized}InDb.ts`
	const updatePath = `${path}/update${capitalized}InDb.ts`
	const selectPath = `${path}/select${capitalized}InDb.ts`
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
