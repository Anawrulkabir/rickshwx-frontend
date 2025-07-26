// Types
export interface Student {
  id: string
  name: string
  email: string
  studentId: string
  phone: string
  avatar: string
  wallet: number
  totalRides: number
  totalSpent: number
  avgRating: number
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  vehicleType: string
  vehicleNumber: string
  licenseNumber: string
  status: string
  rating: number
  totalRides: number
  isOnline: boolean
  currentLocation: {
    lat: number
    lng: number
    address: string
  }
  earnings: {
    today: number
    thisMonth: number
  }
}

export interface DataFile {
  students: Student[]
  drivers: Driver[]
  rides: any[]
  locations: any[]
}

// Client-side data manager that uses API calls
class ClientDataManager {
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // Student operations
  async addStudent(studentData: Omit<Student, 'id' | 'wallet' | 'totalRides' | 'totalSpent' | 'avgRating'>): Promise<Student> {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add student')
    }

    return response.json()
  }

  async getStudent(id: string): Promise<Student | null> {
    const response = await fetch(`/api/students/${id}`)
    if (!response.ok) return null
    return response.json()
  }

  async getStudentByEmail(email: string): Promise<Student | null> {
    const response = await fetch(`/api/students/email/${encodeURIComponent(email)}`)
    if (!response.ok) return null
    return response.json()
  }

  async getAllStudents(): Promise<Student[]> {
    const response = await fetch('/api/students')
    if (!response.ok) return []
    const data = await response.json()
    return data.students || []
  }

  // Driver operations
  async addDriver(driverData: Omit<Driver, 'id' | 'rating' | 'totalRides' | 'isOnline' | 'currentLocation' | 'earnings'>): Promise<Driver> {
    const response = await fetch('/api/drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add driver')
    }

    return response.json()
  }

  async getDriver(id: string): Promise<Driver | null> {
    const response = await fetch(`/api/drivers/${id}`)
    if (!response.ok) return null
    return response.json()
  }

  async getDriverByPhone(phone: string): Promise<Driver | null> {
    const response = await fetch(`/api/drivers/phone/${encodeURIComponent(phone)}`)
    if (!response.ok) return null
    return response.json()
  }

  async getAllDrivers(): Promise<Driver[]> {
    const response = await fetch('/api/drivers')
    if (!response.ok) return []
    const data = await response.json()
    return data.drivers || []
  }

  async updateDriverStatus(driverId: string, isOnline: boolean): Promise<boolean> {
    const response = await fetch(`/api/drivers/${driverId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOnline }),
    })

    return response.ok
  }

  // General data operations
  async getData(): Promise<DataFile> {
    const response = await fetch('/api/data')
    if (!response.ok) return { students: [], drivers: [], rides: [], locations: [] }
    return response.json()
  }
}

export const dataManager = new ClientDataManager() 