import { useAuth, UserRole } from './auth-context'

/**
 * Check if user has a specific role
 */
export function useUserRole(requiredRole: UserRole | UserRole[]) {
  const { user } = useAuth()

  if (!user) return false

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role)
  }

  return user.role === requiredRole
}

/**
 * Check if user has admin access
 */
export function useIsAdmin() {
  return useUserRole('admin')
}

/**
 * Check if user is an artist or admin
 */
export function useIsArtist() {
  return useUserRole(['artist', 'admin'])
}

/**
 * Check multiple permissions
 */
export function checkPermission(
  userRole: UserRole | null,
  permission: string
): boolean {
  const permissions: Record<UserRole, string[]> = {
    member: [
      'read:tracks',
      'read:artists',
      'read:own-profile',
      'update:own-profile',
      'create:submission', // Allow members to submit tracks
      'read:own-submissions',
      'create:track',
      'update:own-tracks',
    ],
    artist: [
      'read:tracks',
      'read:artists',
      'read:own-profile',
      'update:own-profile',
      'create:submission',
      'read:own-submissions',
      'read:own-tracks',
      'create:track',
      'update:own-tracks',
    ],
    admin: [
      '*', // Admin has all permissions
    ],
  }

  if (!userRole) return false
  if (permissions[userRole].includes('*')) return true
  return permissions[userRole].includes(permission)
}

/**
 * Hook to check if user can perform an action
 */
export function useCanPerform(action: string) {
  const { user } = useAuth()
  return checkPermission(user?.role ?? null, action)
}
