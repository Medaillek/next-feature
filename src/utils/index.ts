import fs from 'node:fs/promises'
import { PermissionType } from '../data'
import { z } from 'zod'

export async function doesPathExist(path: string): Promise<boolean> {
	try {
		await fs.access(path)
		return true
	} catch {
		return false
	}
}

export const readJsonFile = async (
	path: string
): Promise<Record<string, any | null>> => {
	try {
		const file = await fs.readFile(path, 'utf-8')
		return JSON.parse(file)
	} catch (error) {
		console.error(error)
		return null
	}
}

export const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1)

const crudOperations = ['create', 'read', 'update', 'delete'] as const

const crudOperationMap = {
	create: 'créer',
	read: 'lire',
	update: 'mettre à jour',
	delete: 'supprimer',
}

export type CrudOperation = (typeof crudOperations)[number]

export const generateHasPermission = (
	crud: CrudOperation,
	permissionType: PermissionType,
	featureName: string
) => {
	return `
const {${permissionType === 'factory' ? 'factoryId' : 'zoneId'}} = input

const { hasPermission } = await queryUserPermissions(
		ctx.user.id,
		${permissionType},
		${permissionType === 'factory' ? 'factoryId' : 'zoneId'}
	)

if (!hasPermission(${crud}:${featureName}')) {
	throw "Vous n'avez pas la permission de ${
		crudOperationMap[crud]
	} cette ${featureName}."
}
`
}

type DataErrorSuccess<T> = {
	data: T
	error: null
}

type DataErrorFailure = {
	data: null
	error: Error
}

export type DataError<T> = DataErrorSuccess<T> | DataErrorFailure

export const makeDir = async (path: string): Promise<DataError<string>> => {
	try {
		const newDir = await fs.mkdir(path, { recursive: true })
		return { data: newDir, error: null }
	} catch (error) {
		console.error(error)
		return { data: null, error }
	}
}

export const makeFile = async (
	path: string,
	content: string
): Promise<DataError<string>> => {
	try {
		await fs.writeFile(path, content)
		return { data: path, error: null }
	} catch (error) {
		console.error(error)
		return { data: null, error: error }
	}
}

export const rmDir = async (path: string): Promise<DataError<string>> => {
	try {
		await fs.rmdir(path, { recursive: true })
		return { data: path, error: null }
	} catch (error) {
		console.error(error)
		return { data: null, error }
	}
}

export function hasSomeErrors<T>(res: DataError<T>[]) {
	return res.some((r) => r.error !== null)
}

export class DataErrorResults extends Error {
	constructor(
		public results: DataError<unknown>[],
		public featurePath: string,
		public message: string
	) {
		super()
	}
}
