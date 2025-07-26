import fs from 'fs'
import path from 'path'

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

class ServerDataManager {
  private dataPath: string

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'data.json')
  }

  private readData(): DataFile {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading data file:', error)
      return { students: [], drivers: [], rides: [], locations: [] }
    }
  }

  private writeData(data: DataFile): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      console.error('Error writing data file:', error)
      throw new Error('Failed to save data')
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // Student operations
  addStudent(studentData: Omit<Student, 'id' | 'wallet' | 'totalRides' | 'totalSpent' | 'avgRating'>): Student {
    const data = this.readData()
    
    // Check if student already exists
    const existingStudent = data.students.find(
      student => student.email === studentData.email || student.studentId === studentData.studentId
    )
    
    if (existingStudent) {
      throw new Error('Student with this email or student ID already exists')
    }

    const newStudent: Student = {
      ...studentData,
      id: this.generateId(),
      wallet: 0,
      totalRides: 0,
      totalSpent: 0,
      avgRating: 0
    }

    data.students.push(newStudent)
    this.writeData(data)
    
    return newStudent
  }

  getStudent(id: string): Student | null {
    const data = this.readData()
    return data.students.find(student => student.id === id) || null
  }

  getStudentByEmail(email: string): Student | null {
    const data = this.readData()
    return data.students.find(student => student.email === email) || null
  }

  getAllStudents(): Student[] {
    const data = this.readData()
    return data.students
  }

  // Driver operations
  addDriver(driverData: Omit<Driver, 'id' | 'rating' | 'totalRides' | 'isOnline' | 'currentLocation' | 'earnings'>): Driver {
    const data = this.readData()
    
    // Check if driver already exists
    const existingDriver = data.drivers.find(
      driver => driver.phone === driverData.phone || driver.vehicleNumber === driverData.vehicleNumber || driver.email === driverData.email
    )
    
    if (existingDriver) {
      throw new Error('Driver with this phone number, vehicle number, or email already exists')
    }

    const newDriver: Driver = {
      ...driverData,
      id: this.generateId(),
      rating: 0,
      totalRides: 0,
      isOnline: false,
      currentLocation: {
        lat: 22.4596,
        lng: 91.9706,
        address: "Near Main Gate"
      },
      earnings: {
        today: 0,
        thisMonth: 0
      }
    }

    data.drivers.push(newDriver)
    this.writeData(data)
    
    return newDriver
  }

  getDriver(id: string): Driver | null {
    const data = this.readData()
    return data.drivers.find(driver => driver.id === id) || null
  }

  getDriverByEmail(email: string): Driver | null {
    const data = this.readData()
    return data.drivers.find(driver => driver.email === email) || null
  }

  getAllDrivers(): Driver[] {
    const data = this.readData()
    return data.drivers
  }

  updateDriverStatus(driverId: string, isOnline: boolean): boolean {
    const data = this.readData()
    const driver = data.drivers.find(d => d.id === driverId)
    
    if (driver) {
      driver.isOnline = isOnline
      this.writeData(data)
      return true
    }
    
    return false
  }

  // General data operations
  getData(): DataFile {
    return this.readData()
  }
}

export const serverDataManager = new ServerDataManager() 