'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard, Settings, Save, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

type Merchant = {
  id: string
  name: string
  owner_user_id: string
  status: string
  routing_config: any
  created_at: string
}

type Transaction = {
  id: string
  amount: number
  currency: string
  status: string
  created_at: string
  payment_method?: any
}

export default function MerchantDetailsClient({
  merchant,
  transactions: initialTransactions,
}: {
  merchant: Merchant
  transactions: Transaction[]
}) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'config'>('transactions')
  const [selectedAcquirer, setSelectedAcquirer] = useState(
    merchant.routing_config?.defaultAdapter || 'mock'
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const acquirers = [
    {
      id: 'mock',
      name: 'Mock (Testing)',
      description: 'Simulated payment processor for testing',
      available: true,
    },
    {
      id: 'cybersource',
      name: 'CyberSource',
      description: 'Visa payment gateway - Sandbox configured',
      available: true,
    },
    {
      id: 'adyen',
      name: 'Adyen',
      description: 'Global payment platform - Coming soon',
      available: false,
    },
  ]

  const currentAcquirer = acquirers.find((a) => a.id === selectedAcquirer) || acquirers[0]

  const handleSaveConfig = async () => {
    setSaving(true)
    setSaved(false)

    try {
      const supabase = createClient()

      const newRoutingConfig = {
        strategy: 'default',
        defaultAdapter: selectedAcquirer,
        adapters: {
          [selectedAcquirer]: {
            enabled: true,
          },
        },
      }

      const { error } = await supabase
        .from('merchants')
        .update({ routing_config: newRoutingConfig })
        .eq('id', merchant.id)

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error saving configuration')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      succeeded: {
        label: 'Succeeded',
        className: 'bg-[var(--color-success)]/20 text-[var(--color-success)]',
      },
      processing: {
        label: 'Processing',
        className: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]',
      },
      requires_payment_method: {
        label: 'Pending',
        className: 'bg-[var(--color-textSecondary)]/20 text-[var(--color-textSecondary)]',
      },
      failed: {
        label: 'Failed',
        className: 'bg-[var(--color-error)]/20 text-[var(--color-error)]',
      },
    }

    const config = statusConfig[status] || statusConfig.requires_payment_method

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    )
  }

  return (
    <div className="container-hub pt-8 pb-4 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/merchants"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-textSecondary)] hover:text-[var(--color-primary)] mb-4"
        >
          <ArrowLeft size={16} />
          Back to Merchants
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-textPrimary)] mb-2">
          {merchant.name}
        </h1>
        <p className="text-[var(--color-textSecondary)] font-mono text-sm">
          ID: {merchant.id}
        </p>
      </div>

      {/* Info Card */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[var(--color-textSecondary)] mb-1">Status</p>
            <p className="text-lg font-semibold text-[var(--color-textPrimary)] capitalize">
              {merchant.status || 'pending'}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-textSecondary)] mb-1">
              Current Acquirer
            </p>
            <p className="text-lg font-semibold text-[var(--color-primary)]">
              {currentAcquirer.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-textSecondary)] mb-1">Created</p>
            <p className="text-lg font-semibold text-[var(--color-textPrimary)]">
              {formatDate(merchant.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[var(--color-border)]">
        <button
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'transactions'
              ? 'text-[var(--color-primary)]'
              : 'text-[var(--color-textSecondary)] hover:text-[var(--color-textPrimary)]'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          <div className="flex items-center gap-2">
            <CreditCard size={16} />
            Transactions
          </div>
          {activeTab === 'transactions' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
          )}
        </button>
        <button
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'config'
              ? 'text-[var(--color-primary)]'
              : 'text-[var(--color-textSecondary)] hover:text-[var(--color-textPrimary)]'
          }`}
          onClick={() => setActiveTab('config')}
        >
          <div className="flex items-center gap-2">
            <Settings size={16} />
            Acquirer Configuration
          </div>
          {activeTab === 'config' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
          )}
        </button>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-[var(--color-textPrimary)] mb-4">
            Recent Transactions ({initialTransactions.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-textPrimary)]">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-textPrimary)] hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-textPrimary)]">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-textPrimary)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialTransactions.length > 0 ? (
                  initialTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-primary)]/5"
                    >
                      <td className="py-3 px-4 text-sm font-mono text-[var(--color-textSecondary)]">
                        {txn.id.substring(0, 12)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-[var(--color-textSecondary)] hidden md:table-cell">
                        {formatDate(txn.created_at)}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-[var(--color-textPrimary)]">
                        {formatCurrency(txn.amount, txn.currency)}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(txn.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <CreditCard
                        size={48}
                        className="mx-auto mb-4 text-[var(--color-border)]"
                      />
                      <p className="text-[var(--color-textSecondary)]">
                        No transactions yet
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-[var(--color-textPrimary)] mb-2">
            Payment Acquirer Configuration
          </h2>
          <p className="text-sm text-[var(--color-textSecondary)] mb-6">
            Select which payment processor this merchant will use for transactions
          </p>

          <div className="space-y-4 mb-6">
            {acquirers.map((acquirer) => (
              <div
                key={acquirer.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAcquirer === acquirer.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                } ${!acquirer.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => acquirer.available && setSelectedAcquirer(acquirer.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <input
                        type="radio"
                        checked={selectedAcquirer === acquirer.id}
                        onChange={() => acquirer.available && setSelectedAcquirer(acquirer.id)}
                        disabled={!acquirer.available}
                        className="w-4 h-4"
                      />
                      <h3 className="font-semibold text-[var(--color-textPrimary)]">
                        {acquirer.name}
                      </h3>
                      {!acquirer.available && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-textSecondary)]/20 text-[var(--color-textSecondary)]">
                          Not Available
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-textSecondary)] ml-7">
                      {acquirer.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveConfig}
              disabled={saving || selectedAcquirer === (merchant.routing_config?.defaultAdapter || 'mock')}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>

            {saved && (
              <div className="flex items-center gap-2 text-[var(--color-success)]">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Configuration saved!</span>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg">
            <p className="text-sm text-[var(--color-textPrimary)]">
              <strong>Note:</strong> Changing the acquirer will affect all future transactions.
              Existing transactions will not be affected.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
