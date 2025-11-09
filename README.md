# DeonPay Hub - Internal Admin System

Internal administration dashboard for managing all DeonPay merchants and operations.

## Features

- **Invitation-only Authentication**: Secure access control with role-based permissions
- **Role-Based Access Control**: Super Admin, Admin, Support, and Analyst roles
- **Merchant Management**: View and manage all registered merchants
- **Organizations System**: Group merchants for better data organization
- **Session Logging**: Track all admin activities for security
- **Dark Mode Support**: Modern UI with theme switching
- **Analytics Dashboard**: Key metrics and insights

## Tech Stack

- **Next.js 15** - App Router with Server Components
- **React 19** - Latest React features
- **TypeScript** - Type safety
- **Supabase** - Authentication and database
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) to view the Hub.

## Database Setup

The Hub requires the following database tables:

- `hub_users` - Admin users with roles
- `hub_invitations` - Invitation tokens
- `organizations` - Merchant groupings
- `merchant_organizations` - Many-to-many relationships
- `hub_audit_log` - Activity tracking
- `hub_analytics_cache` - Performance optimization

Run the migration script in your Supabase SQL editor (see `/infra/migrations/004_create_hub_system.sql` in main repo).

## Deployment

### Vercel

```bash
# Link to Vercel
vercel link

# Deploy to production
vercel --prod
```

Make sure to add environment variables in Vercel dashboard.

## User Roles

- **Super Admin**: Full access to all features including user management
- **Admin**: Manage merchants and organizations
- **Support**: Read-only access with merchant support features
- **Analyst**: Analytics and reporting access

## Security

- Row Level Security (RLS) policies on all tables
- Session logging for audit trail
- Invitation-only user creation
- Secure authentication with Supabase

## License

Proprietary - DeonPay Internal Use Only

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
