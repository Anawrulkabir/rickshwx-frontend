"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Check, XCircle, Clock, MapPin, DollarSign } from "lucide-react"
import { notificationManager, Notification, RideRequest } from "@/utils/notification-manager"

interface NotificationPopupProps {
    userId: string
    userType: 'student' | 'driver'
    onClose: () => void
    notification: Notification
}

export function NotificationPopup({ userId, userType, onClose, notification }: NotificationPopupProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Show notification with a slight delay for animation
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const handleAccept = () => {
        if (notification.type === 'ride_request' && notification.data) {
            notificationManager.respondToRideRequest(
                notification.data.id,
                userId,
                'accepted'
            )
            notificationManager.markAsRead(userId, notification.id)
            onClose()
        }
    }

    const handleDecline = () => {
        if (notification.type === 'ride_request' && notification.data) {
            notificationManager.respondToRideRequest(
                notification.data.id,
                userId,
                'declined'
            )
            notificationManager.markAsRead(userId, notification.id)
            onClose()
        }
    }

    const handleClose = () => {
        notificationManager.markAsRead(userId, notification.id)
        onClose()
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className={`w-full max-w-md mx-4 transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {notification.type === 'ride_request' && <Clock className="w-5 h-5 text-blue-600" />}
                            {notification.type === 'ride_response' && <Check className="w-5 h-5 text-green-600" />}
                            {notification.title}
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
                    <p className="text-gray-600">{notification.message}</p>

                    {notification.type === 'ride_request' && notification.data && (
                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                    <strong>From:</strong> {notification.data.pickup}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                    <strong>To:</strong> {notification.data.destination}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                    <strong>Fare:</strong> ৳{notification.data.fare}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Requested at {formatTime(notification.data.timestamp)}
                            </div>
                        </div>
                    )}

                    {notification.type === 'ride_response' && (
                        <div className="flex items-center gap-2">
                            <Badge variant={notification.data?.status === 'accepted' ? 'default' : 'secondary'}>
                                {notification.data?.status === 'accepted' ? 'Accepted' : 'Declined'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                            </span>
                        </div>
                    )}

                    {notification.type === 'ride_request' && userType === 'driver' && (
                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={handleAccept}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Accept
                            </Button>
                            <Button
                                onClick={handleDecline}
                                variant="outline"
                                className="flex-1"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline
                            </Button>
                        </div>
                    )}

                    {notification.type === 'ride_response' && (
                        <Button onClick={handleClose} className="w-full">
                            Got it
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 