'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getAllPayments, Payment } from '@/lib/firestore-utils'
import Link from 'next/link'

export default function PaymentsManagement() {
  const router = useRouter()
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    const fetchPayments = async () => {
      try {
        const allPayments = await getAllPayments()
        setPayments(allPayments)
      } catch (error) {
        console.error('Error fetching payments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [user, router])

  const filteredPayments = filterStatus
    ? payments.filter((p) => p.status === filterStatus)
    : payments

  const totalRevenue = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  const successCount = payments.filter((p) => p.status === 'success').length
  const failedCount = payments.filter((p) => p.status === 'failed').length
  const pendingCount = payments.filter((p) => p.status === 'pending').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading payments...</p>
      </div>
    )
  }

  const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
    <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-4">
      <p className={`text-sm font-medium ${color} mb-1`}>{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">Payments & Revenue</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="text-green-400" />
          <StatCard title="Successful" value={successCount} color="text-cyan-400" />
          <StatCard title="Failed" value={failedCount} color="text-red-400" />
          <StatCard title="Pending" value={pendingCount} color="text-yellow-400" />
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {['All', 'success', 'failed', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilterStatus(status === 'All' ? null : status)
              }
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === (status === 'All' ? null : status)
                  ? 'bg-cyan-500 text-white'
                  : 'bg-dark-bg/50 border border-cyan-500/30 text-gray-300 hover:border-cyan-500'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg/50 border-b border-cyan-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-cyan-500/10 hover:bg-dark-bg/80 transition">
                    <td className="px-6 py-4 text-white font-mono text-xs">
                      {payment.stripePaymentId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{payment.type}</td>
                    <td className="px-6 py-4 text-white font-bold">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          payment.status === 'success'
                            ? 'bg-green-500/20 text-green-300'
                            : payment.status === 'failed'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {payment.createdAt?.toDate().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No payments found</p>
          </div>
        )}
      </div>
    </div>
  )
}
