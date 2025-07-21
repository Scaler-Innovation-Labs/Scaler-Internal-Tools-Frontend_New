"use client"

import { useAuth } from '@/hooks/auth/use-auth'
import { useUser } from '@/hooks/auth/use-user'
import { hasAdminRole } from '@/lib/utils'

export default function DebugRoles() {
  const { userRoles, isLoading } = useAuth()
  const { userData } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Debug: User Roles</h2>
      
      <div className="space-y-3">
        <div>
          <strong>User ID:</strong> {userData?.id || 'Not found'}
        </div>
        
        <div>
          <strong>Username:</strong> {userData?.username || 'Not found'}
        </div>
        
        <div>
          <strong>Current Roles:</strong>
          <ul className="list-disc ml-6">
            {userRoles.length > 0 ? (
              userRoles.map((role, index) => (
                <li key={index} className="text-blue-600">{role}</li>
              ))
            ) : (
              <li className="text-red-600">No roles found</li>
            )}
          </ul>
        </div>
        
        <div>
          <strong>Has Admin Role:</strong> 
          <span className={hasAdminRole(userRoles) ? 'text-green-600' : 'text-red-600'}>
            {hasAdminRole(userRoles) ? ' ✅ Yes' : ' ❌ No'}
          </span>
        </div>
        
        <div>
          <strong>Required Admin Roles:</strong>
          <ul className="list-disc ml-6">
            <li>ADMIN</li>
            <li>SUPER_ADMIN</li>
            <li>STUDENT_ADMIN</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
