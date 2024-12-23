import { DataError, makeFile } from '../../../utils'

function makeIndexFile() {
	return `
    export * from './create'
    export * from './delete'
    export * from './update'
    export * from './select
   `.trim()
}

export function makeDbDir(path: string): Promise<DataError<string>[]> {
	const indexFile = makeIndexFile()

	const createPath = `${path}/create.ts`
	const deletePath = `${path}/delete.ts`
	const updatePath = `${path}/update.ts`
	const selectPath = `${path}/select.ts`
	const indexPath = `${path}/index.ts`

	const createFileProm = makeFile(createPath, '')
	const deleteFileProm = makeFile(deletePath, '')
	const updateFileProm = makeFile(updatePath, '')
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
