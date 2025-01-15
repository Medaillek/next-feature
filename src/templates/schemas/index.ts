import {
	DataError,
	DataErrorResults,
	hasSomeErrors,
	makeDir,
	makeFile,
} from '../../utils'
import { clientSchemasTemplate } from './client'
import { serverSchemasTemplate } from './server'

async function buildSchemaDir(
	featureName: string,
	tableName: string,
	path: string
): Promise<DataError<string>[]> {
	const clientTemplate = clientSchemasTemplate(featureName)
	const serverTemplate = serverSchemasTemplate(featureName, tableName)

	const clientPath = `${path}/client`
	const serverPath = `${path}/server`

	const folderProms = [makeDir(clientPath), makeDir(serverPath)]

	const folderResults = await Promise.all(folderProms)

	const isFolderError = hasSomeErrors(folderResults)

	if (isFolderError) {
		return folderResults
	}

	const clientFileProm = makeFile(clientPath + '/index.ts', clientTemplate)
	const serverFileProm = makeFile(serverPath + '/index.ts', serverTemplate)

	return Promise.all([clientFileProm, serverFileProm])
}

export async function makeSchemaDir(
	featureName: string,
	featurePath: string,
	tableName: string
) {
	const schemaPath = featurePath + '/schemas'

	const schemaFolderResults = await makeDir(schemaPath).then((res) => {
		if (res.error) {
			return [res]
		}
		return buildSchemaDir(featureName, tableName, res.data)
	})

	const isSchemaFolderError = hasSomeErrors(schemaFolderResults)

	if (isSchemaFolderError) {
		throw new DataErrorResults(
			schemaFolderResults,
			featurePath,
			'Failed to create schema folder'
		)
	}
}
