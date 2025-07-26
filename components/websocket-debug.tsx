"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WebSocketStatus } from './websocket-status'
import { Bug, Eye, EyeOff, Trash2, Play } from 'lucide-react'
import { testWebSocketConnection, testWebSocketEvents, logWebSocketState } from '@/utils/websocket-test'

interface WebSocketDebugProps {
  isConnected: boolean
  error: any
  events: any[]
  clearEvents: () => void
  socket: any
  className?: string
}

export const WebSocketDebug: React.FC<WebSocketDebugProps> = ({
  isConnected,
  error,
  events,
  clearEvents,
  socket,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false)

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          <Bug className="w-4 h-4 mr-2" />
          WebSocket Debug
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-96 max-h-96 ${className}`}>
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="w-4 h-4" />
              WebSocket Debug
            </CardTitle>
            <div className="flex items-center gap-2">
              <WebSocketStatus isConnected={isConnected} error={error} />
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="ghost"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Connection Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Status:</span>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Error: {error.message || JSON.stringify(error)}
              </div>
            )}
            
            {/* Test Buttons */}
            <div className="flex gap-1">
              <Button
                onClick={() => testWebSocketConnection(socket)}
                size="sm"
                variant="outline"
                className="text-xs h-6 px-2"
              >
                <Play className="w-3 h-3 mr-1" />
                Test
              </Button>
              <Button
                onClick={() => testWebSocketEvents(socket)}
                size="sm"
                variant="outline"
                className="text-xs h-6 px-2"
              >
                Events
              </Button>
              <Button
                onClick={() => logWebSocketState(socket)}
                size="sm"
                variant="outline"
                className="text-xs h-6 px-2"
              >
                State
              </Button>
            </div>
          </div>

          {/* Events */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Recent Events ({events.length})</span>
              <Button
                onClick={clearEvents}
                size="sm"
                variant="ghost"
                className="h-6 px-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {events.slice(-5).reverse().map((event, index) => (
                <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                  <div className="font-medium text-blue-600">{event.type}</div>
                  <div className="text-gray-600">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-500 truncate">
                    {JSON.stringify(event.data).substring(0, 50)}...
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-2">
                  No events yet
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 