import {
	capitalize,
	DataErrorResults,
	hasSomeErrors,
	makeDir,
	makeFile,
} from '../../utils'
import { buildFormTemplate } from './forms'

function indexTemplate(featureName: string) {
	return `
    export * from './create${featureName}Form'
    export * from './delete${featureName}Form'
    export * from './update${featureName}Form'
    `.trim()
}

export async function makeComponentsDir(
	featureName: string,
	featurePath: string
) {
	const capi = capitalize(featureName)
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

	const deletePath = `${formPath}/delete${capi}Form.tsx`
	const createPath = `${formPath}/create${capi}Form.tsx`
	const updatePath = `${formPath}/update${capi}Form.tsx`

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
	const indexFile = makeFile(`${formPath}/index.ts`, indexTemplate(capi))

	const res = await Promise.all([deleteFile, createFile, updateFile, indexFile])

	if (hasSomeErrors(res)) {
		throw new DataErrorResults(
			res,
			`${formPath}/index.ts`,
			'Failed to create form files'
		)
	}
}
