'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getAllUsers, UserProfile, updateUserProfile } from '@/lib/firestore-utils'
import Link from 'next/link'

export default function UsersManagement() {
  const router = useRouter()
  const { user } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, router])

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || u.role === filterRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-2">Manage user roles and accounts</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
          />
          <select
            value={filterRole || ''}
            onChange={(e) => setFilterRole(e.target.value || null)}
            className="bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
          >
            <option value="">All Roles</option>
            <option value="member">Member</option>
            <option value="artist">Artist</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg/50 border-b border-cyan-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Subscription</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="border-b border-cyan-500/10 hover:bg-dark-bg/80 transition">
                    <td className="px-6 py-4 text-white font-medium">{u.displayName}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{u.subscriptionStatus}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {u.createdAt?.toDate().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/users/${u.uid}`}
                        className="text-cyan-400 hover:text-cyan-300 transition"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}
