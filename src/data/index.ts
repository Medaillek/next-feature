export const permissionTypes = ['factory', 'zone'] as const

export type PermissionType = (typeof permissionTypes)[number]
