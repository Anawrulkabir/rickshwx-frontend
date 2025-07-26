import { dataManager } from "./data-manager"

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

export interface Ride {
  id: string
  studentId: string
  driverId: string
  pickup: string
  destination: string
  fare: number
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled"
  createdAt: string
  completedAt?: string
  rating?: number
  distance: string
}

export interface Location {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface RideRequest {
  id: string
  studentId: string
  driverId: string
  pickup: string
  destination: string
  estimatedFare: number
  distance: string
  createdAt: string
  status: "pending" | "accepted" | "declined"
}

// API Functions
export const api = {
  // Students
  getStudent: async (id: string): Promise<Student | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate API delay
    return dataManager.getStudent(id)
  },

  getStudents: async (): Promise<Student[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return dataManager.getAllStudents()
  },

  // Drivers
  getDriver: async (id: string): Promise<Driver | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return dataManager.getDriver(id)
  },

  getAvailableDrivers: async (): Promise<Driver[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const drivers = await dataManager.getAllDrivers()
    return drivers.filter((driver) => driver.isOnline)
  },

  getAllDrivers: async (): Promise<Driver[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return dataManager.getAllDrivers()
  },

  updateDriverStatus: async (driverId: string, isOnline: boolean): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return dataManager.updateDriverStatus(driverId, isOnline)
  },

  // Rides
  getRide: async (id: string): Promise<Ride | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const data = await dataManager.getData()
    return data.rides.find((ride: any) => ride.id === id) || null
  },

  getStudentRides: async (studentId: string): Promise<Ride[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const data = await dataManager.getData()
    return data.rides.filter((ride: any) => ride.studentId === studentId)
  },

  getDriverRides: async (driverId: string): Promise<Ride[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const data = await dataManager.getData()
    return data.rides.filter((ride: any) => ride.driverId === driverId)
  },

  createRideRequest: async (request: Omit<RideRequest, "id" | "createdAt" | "status">): Promise<RideRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newRequest: RideRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: "pending",
    }
    return newRequest
  },

  // Locations
  getLocations: async (): Promise<Location[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const data = await dataManager.getData()
    return data.locations
  },

  // Calculate fare (simple distance-based calculation)
  calculateFare: async (pickup: string, destination: string): Promise<{ fare: number; distance: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Simple fare calculation based on common routes
    const routes: Record<string, Record<string, { fare: number; distance: string }>> = {
      "Main Gate": {
        Library: { fare: 25, distance: "1.2 km" },
        Cafeteria: { fare: 30, distance: "1.5 km" },
        "CSE Building": { fare: 35, distance: "1.8 km" },
        "Academic Building": { fare: 40, distance: "2.0 km" },
        Hostel: { fare: 45, distance: "2.3 km" },
      },
      Library: {
        "Main Gate": { fare: 25, distance: "1.2 km" },
        Cafeteria: { fare: 20, distance: "0.8 km" },
        "CSE Building": { fare: 25, distance: "1.0 km" },
        "Academic Building": { fare: 30, distance: "1.3 km" },
        Hostel: { fare: 35, distance: "1.5 km" },
      },
      Cafeteria: {
        "Main Gate": { fare: 30, distance: "1.5 km" },
        Library: { fare: 20, distance: "0.8 km" },
        "CSE Building": { fare: 15, distance: "0.5 km" },
        "Academic Building": { fare: 20, distance: "0.8 km" },
        Hostel: { fare: 25, distance: "1.0 km" },
      },
      "CSE Building": {
        "Main Gate": { fare: 35, distance: "1.8 km" },
        Library: { fare: 25, distance: "1.0 km" },
        Cafeteria: { fare: 15, distance: "0.5 km" },
        "Academic Building": { fare: 15, distance: "0.3 km" },
        Hostel: { fare: 20, distance: "0.7 km" },
      },
      "Academic Building": {
        "Main Gate": { fare: 40, distance: "2.0 km" },
        Library: { fare: 30, distance: "1.3 km" },
        Cafeteria: { fare: 20, distance: "0.8 km" },
        "CSE Building": { fare: 15, distance: "0.3 km" },
        Hostel: { fare: 15, distance: "0.4 km" },
      },
      Hostel: {
        "Main Gate": { fare: 45, distance: "2.3 km" },
        Library: { fare: 35, distance: "1.5 km" },
        Cafeteria: { fare: 25, distance: "1.0 km" },
        "CSE Building": { fare: 20, distance: "0.7 km" },
        "Academic Building": { fare: 15, distance: "0.4 km" },
      },
    }

    const route = routes[pickup]?.[destination]
    return route || { fare: 20, distance: "1.0 km" } // Default fare
  },
}
