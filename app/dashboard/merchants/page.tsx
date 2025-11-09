import { createClient } from '@/lib/supabase'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function MerchantsPage() {
  const supabase = await createClient()

  // Fetch all merchants
  const { data: merchants, error } = await supabase
    .from('merchants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching merchants:', error)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-textPrimary)]">Merchants</h1>
          <p className="text-[var(--color-textSecondary)] mt-1">
            Manage all DeonPay merchants
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Add Merchant
        </button>
      </div>

      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Merchant</th>
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Owner ID</th>
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Created</th>
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchants && merchants.length > 0 ? (
              merchants.map((merchant) => (
                <tr key={merchant.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-textPrimary)]">{merchant.name}</p>
                        <p className="text-sm text-[var(--color-textSecondary)]">{merchant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--color-textSecondary)] font-mono text-sm">
                    {merchant.owner_user_id.substring(0, 8)}...
                  </td>
                  <td className="p-4 text-[var(--color-textSecondary)]">
                    {new Date(merchant.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/dashboard/merchants/${merchant.id}`}
                      className="text-[var(--color-primary)] hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--color-textSecondary)]">
                  No merchants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
