"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Car, DollarSign, MapPin, Star, Bell, TrendingUp, Navigation, Phone, User, Zap } from "lucide-react"
import Link from "next/link"
import { api, type Driver, type Student } from "@/utils/api"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationPopup } from "@/components/notification-popup"
import { notificationManager } from "@/utils/notification-manager"
import { useWebSocket } from "@/hooks/use-websocket"
import { WebSocketStatus } from "@/components/websocket-status"
import { WebSocketDebug } from "@/components/websocket-debug"

interface RideRequest {
  requestId: string
  student: Student
  pickup: string
  destination: string
  fare: number
  distance: string
  timestamp: string
}

export default function RickshawDashboard() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [hasActiveRide, setHasActiveRide] = useState(false)
  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // WebSocket connection
  const {
    socket,
    isConnected,
    events,
    error,
    acceptRide,
    declineRide,
    startTrip,
    completeTrip,
    updateLocation,
    clearEvents
  } = useWebSocket(token || '', 'driver')

  // Notification system
  const { unreadCount, currentNotification, closeNotification } = useNotifications("1") // Driver ID "1"

  const connectionStatus = isConnected ? "Connected" : error ? "Error" : "Disconnected"

  useEffect(() => {
    loadDriverData()
  }, [])

  useEffect(() => {
    if (driver) {
      api.updateDriverStatus(driver.id, isOnline)
    }
  }, [isOnline, driver])

  // Handle WebSocket events
  useEffect(() => {
    events.forEach(event => {
      switch (event.type) {
        case 'ride_request':
          handleIncomingRideRequest(event.data)
          break
        case 'ride_accepted':
          console.log('Ride accepted:', event.data)
          break
        case 'trip_started':
          console.log('Trip started:', event.data)
          break
        case 'trip_completed':
          console.log('Trip completed:', event.data)
          break
        case 'driver_status_update':
          console.log('Driver status updated:', event.data)
          break
        case 'driver_location':
          console.log('Driver location updated:', event.data)
          break
      }
    })
  }, [events])

  // const loadDriverData = async () => {
  //   try {
  //     const driverData = await api.getDriver("1") // Current driver
  //     setDriver(driverData)
  //     if (driverData) {
  //       setIsOnline(driverData.isOnline)
  //     }
  //   } catch (error) {
  //     console.error("Error loading driver data:", error)
  //   }
  // }
  // {
  //   "id": 6,
  //   "email": "abdul@gmail.com",
  //   "phone": "+8801537134753",
  //   "name": "adbul",
  //   "type": "driver",
  //   "created_at": "2025-07-26T09:56:12.020Z",
  //   "driver": {
  //     "id": 3,
  //     "vehicleType": "Rickshaw",
  //     "vehicleNumber": "1222112312",
  //     "licenseNumber": "13321213",
  //     "status": "offline"
  //   }
  // }

  const loadDriverData = async () => {
    // Simulate fetching the provided driver object
    const data = {
      id: 6,
      email: "abdul@gmail.com",
      phone: "+8801537134753",
      name: "adbul",
      type: "driver",
      created_at: "2025-07-26T09:56:12.020Z",
      driver: {
        id: 3,
        vehicleType: "Rickshaw",
        vehicleNumber: "1222112312",
        licenseNumber: "13321213",
        status: "offline"
      }
    }
    // Flatten the driver object for dashboard use
    setDriver({
      id: data.driver.id.toString(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      vehicleType: data.driver.vehicleType,
      vehicleNumber: data.driver.vehicleNumber,
      licenseNumber: data.driver.licenseNumber,
      status: data.driver.status,
      // Add mock values for missing fields to avoid errors
      avatar: "/placeholder-user.jpg",
      rating: 4.8,
      totalRides: 120,
      isOnline: data.driver.status === "online",
      currentLocation: {
        lat: 0,
        lng: 0,
        address: "CUET Main Gate"
      },
      earnings: {
        today: 500,
        thisMonth: 12000
      }
    })
  }

  const handleIncomingRideRequest = (requestData: RideRequest) => {
    if (isOnline) {
      setRideRequest({
        ...requestData,
        timestamp: new Date().toISOString(),
      })
      setShowRequestDialog(true)
    }
  }

  const handleAcceptRide = () => {
    if (rideRequest) {
      // Send acceptance via WebSocket
      acceptRide(rideRequest.requestId)

      setHasActiveRide(true)
      setShowRequestDialog(false)
      setRideRequest(null)
    }
  }

  const handleDeclineRide = () => {
    if (rideRequest) {
      // Send decline via WebSocket
      declineRide(rideRequest.requestId)

      setShowRequestDialog(false)
      setRideRequest(null)
    }
  }

  const handleCompleteTrip = () => {
    if (rideRequest) {
      // Send trip completion via WebSocket
      completeTrip(rideRequest.requestId)
    }
    setHasActiveRide(false)
    // Update earnings and stats here
  }

  // if (!driver) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
  //       <div className="text-center">Loading...</div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Hello, {driver?.name.split(" ")[0]}!</h1>
              <p className="text-sm text-gray-500">Ready to earn today?</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <WebSocketStatus isConnected={isConnected} error={error} />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {(unreadCount > 0 || rideRequest) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount > 0 ? unreadCount : 1}
                </span>
              )}
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={driver?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {driver?.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Online Status Toggle */}
        <Card className={`border-2 ${isOnline ? "border-emerald-200 bg-emerald-50" : "border-gray-200"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}></div>
                <div>
                  <div className="font-semibold">{isOnline ? "You are Online" : "You are Offline"}</div>
                  <div className="text-sm text-gray-600">
                    {isOnline ? "Ready to accept rides" : "Not accepting rides"}
                  </div>
                </div>
              </div>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
          </CardContent>
        </Card>

        {/* Driver Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Driver Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">Name: {driver?.name}</div>
            <div className="text-sm text-gray-700">Email: {driver?.email}</div>
            <div className="text-sm text-gray-700">Phone: {driver?.phone}</div>
            <div className="text-sm text-gray-700">License: {driver?.licenseNumber}</div>
            <div className="text-sm text-gray-700">Status: {driver?.status}</div>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600">৳340</div>
              <div className="text-sm text-gray-600">Today's Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-gray-600">Total Rides</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">4.5</div>
              <div className="text-sm text-gray-600">Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{driver?.status ? "Online" : "Offline"}</div>
              <div className="text-sm text-gray-600">Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">{driver?.currentLocation.address}</div>
            <div className="text-xs text-gray-500 mt-1">
              Vehicle: {driver?.vehicleType} • {driver?.vehicleNumber}
            </div>
            <Button
              onClick={() => updateLocation(driver?.currentLocation || { lat: 0, lng: 0, address: "CUET Main Gate" })}
              className="mt-3 w-full"
              size="sm"
              disabled={!isConnected}
            >
              Update Location
            </Button>
          </CardContent>
        </Card>

        {/* Active Ride */}
        {hasActiveRide && rideRequest && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Active Ride
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={rideRequest.student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {rideRequest.student.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{rideRequest.student.name}</div>
                    <div className="text-sm text-gray-500">ID: {rideRequest.student.studentId}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                  <span>
                    {rideRequest.pickup} → {rideRequest.destination}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Fare: <span className="font-semibold text-emerald-600">৳{rideRequest.fare}</span> •{" "}
                  {rideRequest.distance}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Navigate
                </Button>
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleCompleteTrip}>
                  Complete Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/rickshaw/earnings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-medium">Earnings</div>
                <div className="text-sm text-gray-500">৳{driver?.earnings.thisMonth}</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/rickshaw/profile">
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

      {/* Ride Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              New Ride Request!
            </DialogTitle>
            <DialogDescription>You have a new ride request from a student</DialogDescription>
          </DialogHeader>

          {rideRequest && (
            <div className="space-y-4">
              {/* Student Info */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={rideRequest.student.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {rideRequest.student.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{rideRequest.student.name}</div>
                  <div className="text-sm text-gray-600">Student ID: {rideRequest.student.studentId}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {rideRequest.student.avgRating}
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-600">From:</span>
                  <span className="ml-1 font-medium">{rideRequest.pickup}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-gray-600">To:</span>
                  <span className="ml-1 font-medium">{rideRequest.destination}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-emerald-700">৳{rideRequest.fare}</div>
                    <div className="text-sm text-gray-600">{rideRequest.distance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Estimated</div>
                    <div className="text-xs text-gray-500">5-8 mins</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleDeclineRide} className="flex-1 bg-transparent">
                  Decline
                </Button>
                <Button onClick={handleAcceptRide} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Accept Ride
                </Button>
              </div>

              {/* Timer */}
              <div className="text-center text-sm text-gray-500">Auto-decline in 30 seconds</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/rickshaw/dashboard" className="flex flex-col items-center py-2 text-emerald-600">
            <Car className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/rickshaw/active-trip" className="flex flex-col items-center py-2 text-gray-400">
            <Navigation className="w-5 h-5" />
            <span className="text-xs mt-1">Trip</span>
          </Link>
          <Link href="/rickshaw/earnings" className="flex flex-col items-center py-2 text-gray-400">
            <DollarSign className="w-5 h-5" />
            <span className="text-xs mt-1">Earnings</span>
          </Link>
          <Link href="/rickshaw/profile" className="flex flex-col items-center py-2 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Notification Popup */}
      {currentNotification && (
        <NotificationPopup
          userId="1"
          userType="driver"
          notification={currentNotification}
          onClose={closeNotification}
        />
      )}

      {/* WebSocket Debug Panel */}
      <WebSocketDebug
        isConnected={isConnected}
        error={error}
        events={events}
        clearEvents={clearEvents}
        socket={socket}
      />
    </div>
  )
}