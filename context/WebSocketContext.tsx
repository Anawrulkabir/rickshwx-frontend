"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useWebSocket } from '@/hooks/use-websocket'

interface WebSocketContextType {
    isConnected: boolean
    events: any[]
    error: any
    sendRideRequest: (data: any) => void
    acceptRide: (rideId: string) => void
    declineRide: (rideId: string) => void
    startTrip: (rideId: string) => void
    completeTrip: (rideId: string) => void
    updateLocation: (location: { lat: number; lng: number; address: string }) => void
    clearEvents: () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

interface WebSocketProviderProps {
    children: ReactNode
    token: string
    userType: 'driver' | 'student'
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children,
    token,
    userType
}) => {
    const webSocket = useWebSocket(token, userType)

    return (
        <WebSocketContext.Provider value={webSocket}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext)
    if (context === undefined) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider')
    }
    return context
} 