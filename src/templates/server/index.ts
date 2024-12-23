import { PermissionType } from '../../data'
import { DataErrorResults, hasSomeErrors, makeDir } from '../../utils'
import { makeActionDir } from './actions'
import { makeDbDir } from './db'

export async function makeServerDir(
	featureName: string,
	featurePath: string,
	permissionType: PermissionType
) {
	const serverPath = featurePath + '/server'
	const serverFolder = await makeDir(serverPath)

	if (serverFolder.error) {
		throw new DataErrorResults(
			[serverFolder],
			featurePath,
			'Failed to create server folder'
		)
	}

	const actionFolderPath = `${serverFolder.data}/actions`

	const actionFolderProm = makeDir(actionFolderPath).then((res) => {
		if (res.error) {
			return [res]
		}
		return makeActionDir(featureName, permissionType, res.data)
	})

	const dbFolderPath = `${serverFolder.data}/db`

	const dbFolderProm = makeDir(dbFolderPath).then((res) => {
		if (res.error) {
			return [res]
		}
		return makeDbDir(res.data)
	})

	const [actionFolderResults, dbFolder] = await Promise.all([
		actionFolderProm,
		dbFolderProm,
	])

	const isActionFolderError = hasSomeErrors(actionFolderResults)

	if (isActionFolderError) {
		throw new DataErrorResults(
			actionFolderResults,
			featurePath,
			'Failed to create action folder'
		)
	}

	const isDbFolderError = hasSomeErrors(dbFolder)

	if (isDbFolderError) {
		throw new DataErrorResults(
			dbFolder,
			featurePath,
			'Failed to create db folder'
		)
	}
}
