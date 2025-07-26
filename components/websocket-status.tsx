import React from 'react'

interface WebSocketStatusProps {
    isConnected: boolean
    error: any
    className?: string
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
    isConnected,
    error,
    className = ""
}) => {
    const getStatusText = () => {
        if (isConnected) return "Connected"
        if (error) return "Error"
        return "Disconnected"
    }

    const getStatusColor = () => {
        if (isConnected) return "bg-green-100 text-green-700"
        if (error) return "bg-red-100 text-red-700"
        return "bg-gray-100 text-gray-700"
    }

    return (
        <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor()} ${className}`}>
            WS: {getStatusText()}
        </div>
    )
} 