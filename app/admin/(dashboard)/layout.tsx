"use client"

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/sidebar'

function readCookie(name: string) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Read the admin email set by middleware to avoid a network call
    const email = readCookie('admin_email')
    if (email) setUserEmail(email)
    else setUserEmail('Admin')
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar userEmail={userEmail || 'Admin'} />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  )
}
