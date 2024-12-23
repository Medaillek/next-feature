import { DataErrorResults, hasSomeErrors, makeDir, makeFile } from '../../utils'
import { buildFormTemplate } from './forms'

function indexTemplate() {
	return `
    export * from './create'
    export * from './delete'
    export * from './update'
    `.trim()
}

export async function makeComponentsDir(
	featureName: string,
	featurePath: string
) {
	const componentsDir = await makeDir(`${featurePath}/components`)

	if (componentsDir.error) {
		throw new DataErrorResults(
			[componentsDir],
			`${featurePath}/components`,
			'Unable to create components directory'
		)
	}

	const formDir = await makeDir(`${componentsDir.data}/form`)
	const formPath = formDir.data
	if (formDir.error) {
		throw new DataErrorResults(
			[formDir],
			`${formPath}/form`,
			'Unable to create form directory'
		)
	}

	const deletePath = `${formPath}/delete.tsx`
	const createPath = `${formPath}/create.tsx`
	const updatePath = `${formPath}/update.tsx`

	const deleteFile = makeFile(
		deletePath,
		buildFormTemplate(featureName, 'delete')
	)
	const createFile = makeFile(
		createPath,
		buildFormTemplate(featureName, 'create')
	)
	const updateFile = makeFile(
		updatePath,
		buildFormTemplate(featureName, 'update')
	)
	const indexFile = makeFile(`${formPath}/index.ts`, indexTemplate())

	const res = await Promise.all([deleteFile, createFile, updateFile, indexFile])

	if (hasSomeErrors(res)) {
		throw new DataErrorResults(
			res,
			`${formPath}/index.ts`,
			'Failed to create form files'
		)
	}
}
