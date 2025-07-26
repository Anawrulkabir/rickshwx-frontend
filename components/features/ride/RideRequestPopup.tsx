'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { X, Check, XCircle, Clock, MapPin, DollarSign, Phone } from 'lucide-react'
import { useSocket } from '@/context/SocketContext'

interface RideRequestData {
    rideId: string
    studentName: string
    studentPhone: string
    pickupLocation: string
    destination: string
    estimatedFare: number
    timestamp: string
}

export function RideRequestPopup() {
    const { notifications, respondToRide } = useSocket()
    const [currentRequest, setCurrentRequest] = useState<RideRequestData | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    // Listen for ride request notifications
    useEffect(() => {
        const rideRequestNotification = notifications.find(
            notification => notification.type === 'ride_request_notification'
        )

        if (rideRequestNotification && !currentRequest) {
            setCurrentRequest({
                rideId: rideRequestNotification.rideId,
                studentName: rideRequestNotification.studentName || 'Unknown Student',
                studentPhone: '+880 1712345678', // Mock phone
                pickupLocation: rideRequestNotification.pickupLocation || 'Unknown Location',
                destination: rideRequestNotification.destination || 'Unknown Destination',
                estimatedFare: rideRequestNotification.estimatedFare || 0,
                timestamp: rideRequestNotification.timestamp
            })
            setIsVisible(true)
        }
    }, [notifications, currentRequest])

    const handleAccept = () => {
        if (currentRequest) {
            respondToRide(currentRequest.rideId, 'accept')
            setIsVisible(false)
            setCurrentRequest(null)
        }
    }

    const handleDecline = () => {
        if (currentRequest) {
            respondToRide(currentRequest.rideId, 'reject')
            setIsVisible(false)
            setCurrentRequest(null)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        setCurrentRequest(null)
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isVisible || !currentRequest) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            New Ride Request!
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="h-6 w-6"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Student Info */}
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Avatar className="w-12 h-12">
                            <AvatarFallback>
                                {currentRequest.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="font-medium">{currentRequest.studentName}</div>
                            <div className="text-sm text-gray-600">Student</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-3">
                        <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-gray-600">From:</span>
                            <span className="ml-1 font-medium">{currentRequest.pickupLocation}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-gray-600">To:</span>
                            <span className="ml-1 font-medium">{currentRequest.destination}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-emerald-700">৳{currentRequest.estimatedFare}</div>
                                <div className="text-sm text-gray-600">Estimated fare</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Requested</div>
                                <div className="text-xs text-gray-500">{formatTime(currentRequest.timestamp)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={handleDecline}
                            variant="outline"
                            className="flex-1"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                        </Button>
                    </div>

                    {/* Auto-decline timer */}
                    <div className="text-center text-sm text-gray-500">
                        Auto-decline in 30 seconds
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}