// Permission utilities for user role management
// Note: These are currently unused in the static portfolio but retained for future auth implementation

export type UserRole = 'admin' | 'artist' | 'user'

/**
 * Check if user has a specific role
 */
export function useUserRole(requiredRole: UserRole | UserRole[]) {
  // Placeholder for future auth context integration
  return false
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
    user: [
      'read:tracks',
      'read:artists',
      'read:own-profile',
    ],
    artist: [
      'read:tracks',
      'read:artists',
      'read:own-profile',
      'update:own-profile',
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
  // Placeholder for future auth context integration
  return false
}
