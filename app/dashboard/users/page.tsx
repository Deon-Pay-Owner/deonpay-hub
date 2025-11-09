import { createClient } from '@/lib/supabase'
import { Users, Plus } from 'lucide-react'

export default async function UsersPage() {
  const supabase = await createClient()

  // Fetch all hub users
  const { data: users, error } = await supabase
    .from('hub_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700'
      case 'admin':
        return 'bg-blue-100 text-blue-700'
      case 'support':
        return 'bg-green-100 text-green-700'
      case 'analyst':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleLabel = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-textPrimary)]">Hub Users</h1>
          <p className="text-[var(--color-textSecondary)] mt-1">
            Manage internal admin users
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Invite User
        </button>
      </div>

      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">User</th>
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Role</th>
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Status</th>
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Created</th>
              <th className="text-left p-4 text-[var(--color-textSecondary)] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-textPrimary)]">{user.full_name || 'No name'}</p>
                        <p className="text-sm text-[var(--color-textSecondary)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-textSecondary)]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button className="text-[var(--color-primary)] hover:underline text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--color-textSecondary)]">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
