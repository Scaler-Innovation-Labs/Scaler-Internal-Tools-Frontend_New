"use client"

import { useState } from 'react'
import { useAuth } from '@/hooks/auth/use-auth'

export function MessDebugPanel() {
  const { userRoles, isAuthenticated } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const testAuthentication = async () => {
    setTesting(true)
    try {
      // Test if we can access a simple endpoint
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const authData = {
        isAuthenticated,
        userRoles: userRoles,
        authEndpointStatus: response.status,
        authEndpointResponse: response.ok ? await response.json() : null,
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
        currentUrl: window.location.href,
        cookies: document.cookie,
      }
      
      setDebugInfo(authData)
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        isAuthenticated,
        userRoles: userRoles,
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
      })
    }
    setTesting(false)
  }

  const testMessAPI = async () => {
    setTesting(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/mess/admin/vendor/fetchAll`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const messData = {
        messEndpointStatus: response.status,
        messEndpointResponse: response.ok ? await response.json() : null,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        requestUrl: `${backendUrl}/mess/admin/vendor/fetchAll`,
      }
      
      setDebugInfo({ ...debugInfo, messTest: messData })
    } catch (error) {
      setDebugInfo({ 
        ...debugInfo, 
        messTest: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          requestUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/mess/admin/vendor/fetchAll`
        }
      })
    }
    setTesting(false)
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Mess API Debug Panel</h3>
      
      <div className="space-y-2 mb-4">
        <button 
          onClick={testAuthentication}
          disabled={testing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Authentication'}
        </button>
        
        <button 
          onClick={testMessAPI}
          disabled={testing}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          {testing ? 'Testing...' : 'Test Mess API'}
        </button>
      </div>

      {debugInfo && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Debug Information:</h4>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-semibold">Quick Info:</h4>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User Roles: {userRoles.length > 0 ? userRoles.join(', ') : 'None'}</p>
        <p>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}</p>
      </div>
    </div>
  )
}
