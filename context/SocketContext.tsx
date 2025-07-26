'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import io, { Socket } from 'socket.io-client'
import { toast } from '@/components/ui/use-toast'


interface User {
    userId: string
    name: string
    role: 'student' | 'rickshaw' | 'admin'
    email: string
}

interface RideNotification {
    type: string
    rideId: string
    title: string
    message: string
    studentName?: string
    driverName?: string
    pickupLocation?: string
    destination?: string
    estimatedFare?: number
    actualFare?: number
    timestamp: string
}

interface SocketContextType {
    socket: ReturnType<typeof io> | null
    isConnected: boolean
    user: User | null
    notifications: RideNotification[]
    connectUser: (userData: User) => void
    disconnectUser: () => void
    createRideRequest: (rideData: any) => void
    respondToRide: (rideId: string, action: 'accept' | 'reject') => void
    startTrip: (rideId: string) => void
    completeTrip: (rideId: string, actualFare?: number) => void
    updateAvailability: (isAvailable: boolean) => void
    clearNotifications: () => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

interface SocketProviderProps {
    children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [notifications, setNotifications] = useState<RideNotification[]>([])

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://10.19.88.241:8080', {
            transports: ['websocket'],
            autoConnect: false
        })

        setSocket(newSocket)

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('✅ Connected to WebSocket server')
            setIsConnected(true)
        })

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from WebSocket server')
            setIsConnected(false)
        })

        newSocket.on('connect_error', (error: any) => {
            console.error('❌ WebSocket connection error:', error)
            setIsConnected(false)
        })

        return () => {
            newSocket.close()
        }
    }, [])

    // Setup event listeners when user connects
    useEffect(() => {
        if (!socket || !user) return

        // Registration success
        socket.on('registration_success', (data: any) => {
            console.log('👤 User registered:', data.message)
            toast({
                title: "Connected",
                description: "Successfully connected to notification service",
            })
        })

        // Ride request notifications (for drivers)
        socket.on('ride_request_notification', (notification: RideNotification) => {
            console.log('🚨 New ride request:', notification)
            setNotifications(prev => [notification, ...prev])

            // Show popup notification for drivers
            if (user.role === 'rickshaw') {
                showRideRequestPopup(notification)
            }
        })

        // Ride acceptance notification (for students)
        socket.on('ride_accepted', (notification: RideNotification) => {
            console.log('✅ Ride accepted:', notification)
            setNotifications(prev => [notification, ...prev])

            toast({
                title: notification.title,
                description: notification.message,
            })
        })

        // Trip started notification
        socket.on('trip_started', (notification: RideNotification) => {
            console.log('🚀 Trip started:', notification)
            setNotifications(prev => [notification, ...prev])

            toast({
                title: notification.title,
                description: notification.message,
            })
        })

        // Trip completed notification
        socket.on('trip_completed', (notification: RideNotification) => {
            console.log('🏁 Trip completed:', notification)
            setNotifications(prev => [notification, ...prev])

            toast({
                title: notification.title,
                description: notification.message,
            })
        })

        // Ride request created confirmation
        socket.on('ride_request_created', (data: any) => {
            console.log('✅ Ride request created:', data.rideId)
            toast({
                title: "Ride Request Sent",
                description: "Looking for available drivers...",
            })
        })

        // Ride acceptance confirmation (for drivers)
        socket.on('ride_acceptance_confirmed', (data: any) => {
            console.log('✅ Ride acceptance confirmed')
            toast({
                title: "Ride Accepted",
                description: `You accepted the ride to ${data.destination}`,
            })
        })

        // Trip start confirmation
        socket.on('trip_start_confirmed', (data: any) => {
            console.log('✅ Trip start confirmed')
            toast({
                title: "Trip Started",
                description: "Trip has been started successfully",
            })
        })

        // Trip completion confirmation
        socket.on('trip_completion_confirmed', (data: any) => {
            console.log('✅ Trip completion confirmed')
            toast({
                title: "Trip Completed",
                description: `Earned: ৳${data.earnedAmount}`,
            })
        })

        // Error handling
        socket.on('error', (error: any) => {
            console.error('❌ Socket error:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        })

        // Cleanup listeners
        return () => {
            socket.off('registration_success')
            socket.off('ride_request_notification')
            socket.off('ride_accepted')
            socket.off('trip_started')
            socket.off('trip_completed')
            socket.off('ride_request_created')
            socket.off('ride_acceptance_confirmed')
            socket.off('trip_start_confirmed')
            socket.off('trip_completion_confirmed')
            socket.off('error')
        }
    }, [socket, user])

    // Show ride request popup for drivers
    const showRideRequestPopup = (notification: RideNotification) => {
        // This will be handled by a custom popup component
        // You can dispatch a custom event or use a state management solution
        window.dispatchEvent(new CustomEvent('show-ride-popup', {
            detail: notification
        }))
    }

    // Connect user to WebSocket
    const connectUser = (userData: User) => {
        if (socket && !isConnected) {
            socket.connect()
        }

        if (socket && isConnected) {
            socket.emit('register_user', userData)
            setUser(userData)
        }
    }

    // Disconnect user
    const disconnectUser = () => {
        if (socket) {
            socket.disconnect()
        }
        setUser(null)
        setNotifications([])
    }

    // Student creates ride request
    const createRideRequest = (rideData: {
        pickupLocation: string
        destination: string
        estimatedFare: number
    }) => {
        if (socket && user?.role === 'student') {
            socket.emit('create_ride_request', rideData)
        }
    }

    // Driver responds to ride
    const respondToRide = (rideId: string, action: 'accept' | 'reject') => {
        if (socket && user?.role === 'rickshaw') {
            socket.emit('respond_to_ride', { rideId, action })
        }
    }

    // Driver starts trip
    const startTrip = (rideId: string) => {
        if (socket && user?.role === 'rickshaw') {
            socket.emit('start_trip', { rideId })
        }
    }

    // Driver completes trip
    const completeTrip = (rideId: string, actualFare?: number) => {
        if (socket && user?.role === 'rickshaw') {
            socket.emit('complete_trip', { rideId, actualFare })
        }
    }

    // Driver updates availability
    const updateAvailability = (isAvailable: boolean) => {
        if (socket && user?.role === 'rickshaw') {
            socket.emit('update_availability', { isAvailable })
        }
    }

    // Clear notifications
    const clearNotifications = () => {
        setNotifications([])
    }

    const value: SocketContextType = {
        socket,
        isConnected,
        user,
        notifications,
        connectUser,
        disconnectUser,
        createRideRequest,
        respondToRide,
        startTrip,
        completeTrip,
        updateAvailability,
        clearNotifications
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    const context = useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}