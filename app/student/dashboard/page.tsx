"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Navigation, Clock, Star, Wallet, History, Search, Zap, Bell, User, Car } from "lucide-react"
import Link from "next/link"
import { api, type Driver, type Student, type Ride } from "@/utils/api"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationPopup } from "@/components/notification-popup"
import { notificationManager } from "@/utils/notification-manager"
import { useWebSocket } from "@/hooks/use-websocket"
import { WebSocketStatus } from "@/components/websocket-status"
import { WebSocketDebug } from "@/components/websocket-debug"

interface Route {
  id: number
  from_location: string
  to_location: string
  price: string
  duration: number
  distance: string
  created_at: string
}

interface RoutesResponse {
  routes: Route[]
  count: number
}

export default function StudentDashboard() {
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showDrivers, setShowDrivers] = useState(false)
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [estimatedFare, setEstimatedFare] = useState<{ fare: number; distance: string } | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [recentTrips, setRecentTrips] = useState<Ride[]>([])
  const [requestSent, setRequestSent] = useState(false)
  const [routes, setRoutes] = useState<RoutesResponse>({ routes: [], count: 0 })
  const [routeId, setRouteId] = useState<number | null>(null)
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // WebSocket connection
  const {
    socket,
    isConnected,
    events,
    error,
    sendRideRequest,
    clearEvents
  } = useWebSocket(token || '', 'student')

  // Notification system
  const { unreadCount, currentNotification, closeNotification } = useNotifications("1") // Student ID "1"

  const connectionStatus = isConnected ? "Connected" : error ? "Error" : "Disconnected"

  useEffect(() => {
    loadStudentData()
  }, [])

  // Handle WebSocket events
  useEffect(() => {
    events.forEach(event => {
      switch (event.type) {
        case 'ride_accepted':
          handleRideResponse({ status: 'accepted', ...event.data })
          break
        case 'ride_declined':
          handleRideResponse({ status: 'declined', ...event.data })
          break
        case 'trip_started':
          console.log('Trip started:', event.data)
          break
        case 'trip_completed':
          console.log('Trip completed:', event.data)
          break
        case 'payment_processed':
          console.log('Payment processed:', event.data)
          break
      }
    })
  }, [events])

  // const loadStudentData = async () => {
  //   try {
  //     const studentData = await api.getStudent("1") // Current student
  //     setStudent(studentData)

  //     if (studentData) {
  //       const rides = await api.getStudentRides(studentData.id)
  //       setRecentTrips(rides.slice(-3).reverse()) // Last 3 rides
  //     }
  //   } catch (error) {
  //     console.error("Error loading student data:", error)
  //   }
  // }

  //   GET {{userUrl}}/profile
  // Authorization: Bearer {{userToken}}
  // Content-Type: application/json

  // {
  //   "id": 5,
  //   "email": "mdanawrulkabirfahad123@gmail.com",
  //   "phone": "+8801537134759",
  //   "name": "fahad",
  //   "type": "user",
  //   "created_at": "2025-07-26T09:51:58.340Z"
  // }

  const loadStudentData = async () => {
    const response = await fetch('http://10.19.88.241:3000/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    setStudent(data)
  }


  const getAllRoutes = async () => {
    const response = await fetch('http://10.19.88.241:3000/routes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    setRoutes(data)
  }

  useEffect(() => {
    getAllRoutes()
  }, [])


  // {
  //   "routes": [
  //     {
  //       "id": 26,
  //       "from_location": "Banani",
  //       "to_location": "Dhanmondi",
  //       "price": "110.00",
  //       "duration": 22,
  //       "distance": "9.10",
  //       "created_at": "2025-07-26T08:36:17.910Z"
  //     },
  //     {
  //       "id": 27,
  //       "from_location": "Banani",
  //       "to_location": "Gulshan",
  //       "price": "60.00",
  //       "duration": 10,
  //       "distance": "3.50",
  //       "created_at": "2025-07-26T08:36:17.910Z"
  //     },

  //   ],
  //   "count": 30
  // }

  // const handleRideRequest = async () => {
  //   if (!pickup || !destination) return

  //   setIsSearching(true)

  //   try {
  //     // Get available drivers
  //     const drivers = await api.getAvailableDrivers()
  //     setAvailableDrivers(drivers)

  //     // Calculate fare
  //     const fareData = await api.calculateFare(pickup, destination)
  //     setEstimatedFare(fareData)

  //     setShowDrivers(true)
  //   } catch (error) {
  //     console.error("Error fetching drivers:", error)
  //   } finally {
  //     setIsSearching(false)
  //   }
  // }

  const handleRideRequest = async () => {
    const response = await fetch('http://10.19.88.241:3000/rides/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        routeId: routeId
      })
    })
  }

  const handleDriverSelect = async (driver: Driver) => {
    if (!estimatedFare || !student) return

    setSelectedDriver(driver)

    try {
      // Send ride request via WebSocket
      const rideRequestData = {
        studentId: student.id,
        driverId: driver.id,
        student: {
          name: student.name,
          phone: student.phone
        },
        pickup,
        destination,
        fare: estimatedFare.fare,
        distance: estimatedFare.distance,
        status: 'pending'
      }

      sendRideRequest(rideRequestData)
      console.log("Ride request sent via WebSocket:", rideRequestData)
      setRequestSent(true)
    } catch (error) {
      console.error("Error sending ride request:", error)
    }
  }

  const handleRideResponse = (data: any) => {
    if (data.status === "accepted") {
      // Ride accepted - redirect to trip page or show success
      setRequestSent(false)
      setShowDrivers(false)
      setSelectedDriver(null)
      // You can redirect to trip tracking page here
      alert("Ride accepted! Driver is on the way.")
    } else if (data.status === "declined") {
      // Ride declined - show message and allow selecting another driver
      setRequestSent(false)
      alert("Driver declined the ride. Please select another driver.")
    }
  }

  const resetForm = () => {
    setPickup("")
    setDestination("")
    setShowDrivers(false)
    setSelectedDriver(null)
    setEstimatedFare(null)
    setRequestSent(false)
  }

  // if (!student) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
  //       <div className="text-center">Loading...</div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" >
      {/* Header */}
      < header className="bg-white border-b sticky top-0 z-50" >
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Good morning, {student?.name.split(" ")[0]}!</h1>
              <p className="text-sm text-gray-500">Ready for your next ride?</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <WebSocketStatus isConnected={isConnected} error={error} />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={student?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {student?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header >

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{student?.totalRides}</div>
              <div className="text-sm text-gray-600">Rides This Month</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">৳{student?.totalSpent}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{student?.avgRating}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Available Routes
            </CardTitle>
            <CardDescription>Select a route to auto-fill pickup and destination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {routes.routes?.map((route: Route) => (
                <div
                  key={route.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${pickup === route.from_location && destination === route.to_location
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => {
                    setRouteId(route.id)
                    setPickup(route.from_location)
                    setDestination(route.to_location)
                    setEstimatedFare({
                      fare: parseFloat(route.price),
                      distance: `${route.distance} km`
                    })
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {route.from_location} → {route.to_location}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" />
                        {route.duration} mins • {route.distance} km
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-emerald-600">৳{route.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ride Request Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              Request a Ride
            </CardTitle>
            <CardDescription>Where would you like to go?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="pickup"
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="destination"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Show estimated fare if available */}
            {estimatedFare && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-emerald-700">Estimated Fare</div>
                    <div className="text-sm text-gray-600">{estimatedFare.distance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">৳{estimatedFare.fare}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Location Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPickup("Main Gate")
                  setDestination("Library")
                  setEstimatedFare(null) // Clear fare when manually selecting
                }}
              >
                📚 Library
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPickup("Main Gate")
                  setDestination("Cafeteria")
                  setEstimatedFare(null) // Clear fare when manually selecting
                }}
              >
                🍽️ Cafeteria
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPickup("Main Gate")
                  setDestination("CSE Building")
                  setEstimatedFare(null) // Clear fare when manually selecting
                }}
              >
                💻 CSE Building
              </Button>
            </div>

            <Button
              onClick={handleRideRequest}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!pickup || !destination || isSearching}
            >
              {isSearching ? "Finding Drivers..." : "Find Available Drivers"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              Recent Trips
            </CardTitle>
            <Link href="/student/history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {trip.pickup} → {trip.destination}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">৳{trip.fare}</div>
                  {trip.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{trip.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/student/payment">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Wallet className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-medium">Wallet</div>
                <div className="text-sm text-gray-500">৳{student?.wallet} Balance</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/student/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-medium">Profile</div>
                <div className="text-sm text-gray-500">Settings</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Available Drivers Dialog */}
      <Dialog open={showDrivers} onOpenChange={setShowDrivers}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Available Drivers</DialogTitle>
            <DialogDescription>
              {pickup} → {destination}
              {estimatedFare && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium">Estimated Fare: ৳{estimatedFare.fare}</div>
                  <div className="text-xs text-gray-600">Distance: {estimatedFare.distance}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableDrivers.map((driver) => (
              <div key={driver.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={driver.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {driver.rating} • {driver.totalRides} rides
                      </div>
                      <div className="text-xs text-gray-500">{driver.vehicleNumber}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Online
                  </Badge>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {driver.currentLocation.address}
                </div>

                <Button
                  onClick={() => handleDriverSelect(driver)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={requestSent && selectedDriver?.id === driver.id}
                >
                  {requestSent && selectedDriver?.id === driver.id ? (
                    "Request Sent..."
                  ) : (
                    <>
                      <Car className="w-4 h-4 mr-2" />
                      Request This Driver
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/student/dashboard" className="flex flex-col items-center py-2 text-blue-600">
            <Navigation className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/student/trip" className="flex flex-col items-center py-2 text-gray-400">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Trip</span>
          </Link>
          <Link href="/student/history" className="flex flex-col items-center py-2 text-gray-400">
            <History className="w-5 h-5" />
            <span className="text-xs mt-1">History</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center py-2 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Notification Popup */}
      {
        currentNotification && (
          <NotificationPopup
            userId="1"
            userType="student"
            notification={currentNotification}
            onClose={closeNotification}
          />
        )
      }

      {/* WebSocket Debug Panel */}
      <WebSocketDebug
        isConnected={isConnected}
        error={error}
        events={events}
        clearEvents={clearEvents}
        socket={socket}
      />
    </div >
  )
}