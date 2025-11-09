import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, User, Calendar, Key, Activity } from 'lucide-react'

interface MerchantDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MerchantDetailsPage({ params }: MerchantDetailsPageProps) {
  const supabase = await createClient()

  // Fetch merchant data
  const { data: merchant, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !merchant) {
    notFound()
  }

  // Fetch owner user data from auth.users
  const { data: ownerAuth } = await supabase.auth.admin.getUserById(merchant.owner_user_id)

  // Fetch users_profile data
  const { data: ownerProfile } = await supabase
    .from('users_profile')
    .select('*')
    .eq('user_id', merchant.owner_user_id)
    .single()

  return (
    <div className="p-8">
      {/* Header with back button */}
      <div className="mb-8">
        <Link
          href="/dashboard/merchants"
          className="inline-flex items-center gap-2 text-[var(--color-textSecondary)] hover:text-[var(--color-primary)] mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Merchants
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-textPrimary)]">{merchant.name}</h1>
            <p className="text-[var(--color-textSecondary)] mt-1">Merchant Details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Merchant Information Card */}
        <div className="glass rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold text-[var(--color-textPrimary)]">Merchant Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-textSecondary)]">Merchant ID</label>
              <p className="text-[var(--color-textPrimary)] font-mono text-sm mt-1 break-all">{merchant.id}</p>
            </div>

            <div>
              <label className="text-sm text-[var(--color-textSecondary)]">Merchant Name</label>
              <p className="text-[var(--color-textPrimary)] font-medium mt-1">{merchant.name}</p>
            </div>

            <div>
              <label className="text-sm text-[var(--color-textSecondary)]">Created At</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-[var(--color-textSecondary)]" />
                <p className="text-[var(--color-textPrimary)]">
                  {new Date(merchant.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Information Card */}
        <div className="glass rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold text-[var(--color-textPrimary)]">Owner Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-textSecondary)]">Owner User ID</label>
              <p className="text-[var(--color-textPrimary)] font-mono text-sm mt-1 break-all">{merchant.owner_user_id}</p>
            </div>

            {ownerAuth?.user && (
              <>
                <div>
                  <label className="text-sm text-[var(--color-textSecondary)]">Email</label>
                  <p className="text-[var(--color-textPrimary)] mt-1">{ownerAuth.user.email}</p>
                </div>

                <div>
                  <label className="text-sm text-[var(--color-textSecondary)]">Email Confirmed</label>
                  <p className="text-[var(--color-textPrimary)] mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${ownerAuth.user.email_confirmed_at ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {ownerAuth.user.email_confirmed_at ? 'Confirmed' : 'Pending'}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm text-[var(--color-textSecondary)]">Account Created</label>
                  <p className="text-[var(--color-textPrimary)] mt-1">
                    {new Date(ownerAuth.user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}

            {ownerProfile && (
              <div>
                <label className="text-sm text-[var(--color-textSecondary)]">Default Merchant</label>
                <p className="text-[var(--color-textPrimary)] mt-1">
                  {ownerProfile.default_merchant_id === merchant.id ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      This is the default merchant
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Not default
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Card */}
        <div className="glass rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold text-[var(--color-textPrimary)]">Activity & Stats</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-textSecondary)]">Total Transactions</p>
              <p className="text-2xl font-bold text-[var(--color-textPrimary)] mt-1">0</p>
              <p className="text-xs text-[var(--color-textSecondary)] mt-1">Coming soon</p>
            </div>

            <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-textSecondary)]">Total Volume</p>
              <p className="text-2xl font-bold text-[var(--color-textPrimary)] mt-1">$0.00</p>
              <p className="text-xs text-[var(--color-textSecondary)] mt-1">Coming soon</p>
            </div>

            <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-textSecondary)]">Active Status</p>
              <p className="text-2xl font-bold text-green-600 mt-1">Active</p>
              <p className="text-xs text-[var(--color-textSecondary)] mt-1">Operational</p>
            </div>
          </div>
        </div>

        {/* API Keys Section (Placeholder) */}
        <div className="glass rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold text-[var(--color-textPrimary)]">API Keys & Integration</h2>
          </div>

          <div className="text-center py-8">
            <p className="text-[var(--color-textSecondary)]">
              API key management coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
