export interface CampusLocation {
  id: string
  name: string
  description?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'main-gate',
    name: 'Main Gate',
    description: 'Main entrance of CUET campus',
    coordinates: { lat: 22.4607, lng: 91.9690 }
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Central library building',
    coordinates: { lat: 22.4610, lng: 91.9695 }
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria',
    description: 'Student cafeteria and dining area',
    coordinates: { lat: 22.4615, lng: 91.9700 }
  },
  {
    id: 'cse-building',
    name: 'CSE Building',
    description: 'Computer Science and Engineering building',
    coordinates: { lat: 22.4620, lng: 91.9705 }
  },
  {
    id: 'eee-building',
    name: 'EEE Building',
    description: 'Electrical and Electronic Engineering building',
    coordinates: { lat: 22.4625, lng: 91.9710 }
  },
  {
    id: 'mechanical-building',
    name: 'Mechanical Building',
    description: 'Mechanical Engineering building',
    coordinates: { lat: 22.4630, lng: 91.9715 }
  },
  {
    id: 'civil-building',
    name: 'Civil Building',
    description: 'Civil Engineering building',
    coordinates: { lat: 22.4635, lng: 91.9720 }
  },
  {
    id: 'admin-building',
    name: 'Admin Building',
    description: 'Administrative offices',
    coordinates: { lat: 22.4640, lng: 91.9725 }
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    description: 'Main auditorium and conference hall',
    coordinates: { lat: 22.4645, lng: 91.9730 }
  },
  {
    id: 'sports-complex',
    name: 'Sports Complex',
    description: 'Sports facilities and gymnasium',
    coordinates: { lat: 22.4650, lng: 91.9735 }
  }
]

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  studentId: string
  department: string
  avatar?: string
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
  nationalId: string
  drivingLicense: string
  vehicleRegistration: string
  vehicleType: string
  vehicleNumber: string
  avatar?: string
  rating: number
  totalRides: number
  isOnline: boolean
  currentLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  earnings: {
    today: number
    thisMonth: number
    total: number
  }
}

export interface Ride {
  id: string
  studentId: string
  driverId: string
  pickup: string
  destination: string
  fare: number
  distance: string
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  completedAt?: string
  rating?: number
  review?: string
} 