"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, Car, User, TestTube } from "lucide-react"
import { notificationManager } from "@/utils/notification-manager"

export default function TestNotificationsPage() {
    const [testStudent, setTestStudent] = useState({
        name: "Test Student",
        phone: "+880 1712345678"
    })
    const [testDriver, setTestDriver] = useState({
        name: "Test Driver",
        phone: "+880 1812345678"
    })
    const [pickup, setPickup] = useState("Main Gate")
    const [destination, setDestination] = useState("Library")
    const [fare, setFare] = useState(25)
    const [distance, setDistance] = useState("1.2 km")

    const createTestRideRequest = () => {
        // Create a test ride request
        const rideRequest = notificationManager.createRideRequest({
            studentId: "1", // Student ID
            driverId: "1",  // Driver ID
            student: testStudent,
            pickup,
            destination,
            fare,
            distance,
            status: 'pending'
        })

        console.log("Test ride request created:", rideRequest)
        alert("Test ride request created! Check the driver dashboard for notifications.")
    }

    const simulateDriverResponse = (status: 'accepted' | 'declined') => {
        // Get the latest ride request
        const requests = notificationManager.getRideRequests()
        const latestRequest = requests[requests.length - 1]

        if (latestRequest) {
            notificationManager.respondToRideRequest(latestRequest.id, "1", status)
            alert(`Driver ${status} the ride! Check the student dashboard for notifications.`)
        } else {
            alert("No ride requests found. Create one first!")
        }
    }

    const clearAllNotifications = () => {
        notificationManager.clearOldNotifications("1")
        alert("All notifications cleared!")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <TestTube className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Notification System Test</h1>
                    </div>
                    <p className="text-gray-600">Test the ride request and notification system</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Student Test
                            </CardTitle>
                            <CardDescription>Simulate a student creating a ride request</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Student Name</Label>
                                <Input
                                    value={testStudent.name}
                                    onChange={(e) => setTestStudent({ ...testStudent, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Student Phone</Label>
                                <Input
                                    value={testStudent.phone}
                                    onChange={(e) => setTestStudent({ ...testStudent, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Pickup</Label>
                                    <Select value={pickup} onValueChange={setPickup}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Main Gate">Main Gate</SelectItem>
                                            <SelectItem value="Library">Library</SelectItem>
                                            <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                                            <SelectItem value="CSE Building">CSE Building</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Destination</Label>
                                    <Select value={destination} onValueChange={setDestination}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Main Gate">Main Gate</SelectItem>
                                            <SelectItem value="Library">Library</SelectItem>
                                            <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                                            <SelectItem value="CSE Building">CSE Building</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Fare (৳)</Label>
                                    <Input
                                        type="number"
                                        value={fare}
                                        onChange={(e) => setFare(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Distance</Label>
                                    <Input
                                        value={distance}
                                        onChange={(e) => setDistance(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={createTestRideRequest}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                <Bell className="w-4 h-4 mr-2" />
                                Create Test Ride Request
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Driver Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="w-5 h-5 text-emerald-600" />
                                Driver Test
                            </CardTitle>
                            <CardDescription>Simulate driver responses to ride requests</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Driver Name</Label>
                                <Input
                                    value={testDriver.name}
                                    onChange={(e) => setTestDriver({ ...testDriver, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Driver Phone</Label>
                                <Input
                                    value={testDriver.phone}
                                    onChange={(e) => setTestDriver({ ...testDriver, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium">Simulate Driver Response:</h4>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => simulateDriverResponse('accepted')}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        Accept Ride
                                    </Button>
                                    <Button
                                        onClick={() => simulateDriverResponse('declined')}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Decline Ride
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="font-medium mb-2">Test Instructions:</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>1. Create a test ride request (left panel)</p>
                                    <p>2. Open driver dashboard in another tab</p>
                                    <p>3. You should see a notification popup</p>
                                    <p>4. Accept/decline the ride (right panel)</p>
                                    <p>5. Open student dashboard to see response</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Info */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>Current notification system status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {notificationManager.getRideRequests().length}
                                </div>
                                <div className="text-sm text-gray-600">Total Ride Requests</div>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                <div className="text-2xl font-bold text-emerald-600">
                                    {notificationManager.getNotifications("1").length}
                                </div>
                                <div className="text-sm text-gray-600">Student Notifications</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {notificationManager.getUnreadCount("1")}
                                </div>
                                <div className="text-sm text-gray-600">Unread Notifications</div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Button
                                onClick={clearAllNotifications}
                                variant="outline"
                                className="bg-red-50 text-red-600 hover:bg-red-100"
                            >
                                Clear All Notifications
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        This test page simulates the notification system. Open the student and driver dashboards in separate tabs to see notifications in action.
                    </p>
                </div>
            </div>
        </div>
    )
} 