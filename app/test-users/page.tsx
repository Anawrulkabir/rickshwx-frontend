"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, User, Car } from "lucide-react"

interface User {
  id: string
  name: string
  email?: string
  studentId?: string
  phone: string
  vehicleNumber?: string
  role: string
}

export default function TestUsersPage() {
  const [users, setUsers] = useState<{ students: User[], drivers: User[] }>({ students: [], drivers: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/users')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users')
      }
      
      setUsers({
        students: result.data.students.map((student: any) => ({
          ...student,
          role: 'student'
        })),
        drivers: result.data.drivers.map((driver: any) => ({
          ...driver,
          role: 'driver'
        }))
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Registration Test</h1>
          <p className="text-gray-600">Verify that users are being saved to the data file</p>
        </div>

        <div className="flex justify-center mb-6">
          <Button onClick={fetchUsers} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Users
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Students ({users.students.length})
              </CardTitle>
              <CardDescription>Registered student accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading students...</div>
              ) : users.students.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No students registered yet</div>
              ) : (
                <div className="space-y-3">
                  {users.students.map((student) => (
                    <div key={student.id} className="p-3 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{student.name}</h3>
                        <Badge variant="secondary">Student</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Student ID:</strong> {student.studentId}</p>
                        <p><strong>Phone:</strong> {student.phone}</p>
                        <p><strong>ID:</strong> {student.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drivers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-600" />
                Drivers ({users.drivers.length})
              </CardTitle>
              <CardDescription>Registered driver accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading drivers...</div>
              ) : users.drivers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No drivers registered yet</div>
              ) : (
                <div className="space-y-3">
                  {users.drivers.map((driver) => (
                    <div key={driver.id} className="p-3 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{driver.name}</h3>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Driver</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Phone:</strong> {driver.phone}</p>
                        <p><strong>Vehicle:</strong> {driver.vehicleNumber}</p>
                        <p><strong>ID:</strong> {driver.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This page shows all users that have been registered through the registration form.
            <br />
            The data is stored in <code className="bg-gray-100 px-1 rounded">data/data.json</code>
          </p>
        </div>
      </div>
    </div>
  )
} 