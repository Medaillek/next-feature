import inquirer from 'inquirer'
import { permissionTypes } from '../data'
import {
	capitalize,
	DataErrorResults,
	doesPathExist,
	makeDir,
	rmDir,
} from '../utils'
import ora from 'ora'
import chalk from 'chalk'

import { makeSchemaDir } from '../templates/schemas'
import { makeTypesFile } from '../templates/types'
import { makeServerDir } from '../templates/server'
import { makeComponentsDir } from '../templates/components'

let spinner = null

export function main() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'featureFolderPath',
				message: 'What is the path of the feature folder?',
				default: 'src/features',
			},
			{
				type: 'input',
				name: 'featureName',
				message: 'What is the name of the feature?',
			},
			{
				type: 'list',
				name: 'permissionType',
				choices: permissionTypes,
				message: 'What is the permission type?',
			},
			{
				type: 'input',
				name: 'tableName',
				message: 'What is the name of the table to use?',
			},
			{
				type: 'confirm',
				name: 'confirm',
				message: 'Are you sure you want to create this feature?',
			},
		])
		.then(
			async ({ featureName, permissionType, tableName, featureFolderPath }) => {
				const lower = featureName.toLowerCase()
				const capitalized = capitalize(lower)
				const featurePath = `${featureFolderPath}/${capitalized}`

				const featureExists = await doesPathExist(featurePath)

				if (featureExists) {
					console.log(chalk.red('Feature already exists'))
					return
				}

				spinner = ora(`Creating feature ${capitalized}`).start()

				const featureFolder = await makeDir(featurePath)

				if (featureFolder.error) {
					throw new DataErrorResults(
						[featureFolder],
						featurePath,
						'Failed to create feature folder'
					)
				}

				const schemaDirProm = makeSchemaDir(featureName, featurePath, tableName)

				const serverDirProm = makeServerDir(
					featureName,
					featurePath,
					permissionType,
					tableName
				)

				const componentsDirProm = makeComponentsDir(featureName, featurePath)

				const typesFileProm = makeTypesFile(featureName, featurePath)

				await Promise.all([
					schemaDirProm,
					serverDirProm,
					componentsDirProm,
					typesFileProm,
				])

				if (spinner) {
					spinner.succeed(`Created feature ${capitalized}`)
				}
			}
		)
		.catch(async (err) => {
			if (err instanceof DataErrorResults) {
				await rmDir(err.featurePath)
				if (spinner) {
					spinner.fail(err.message)
				}
				console.log(chalk.red(err.results.map((res) => res.error).join('\n')))
				spinner = null
				return
			}
			if (spinner) {
				spinner.fail('Failed to create feature')
			}
			console.error(err)
			spinner = null
		})
}
