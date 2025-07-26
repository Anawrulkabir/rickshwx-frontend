# WebSocket Implementation Guide

This document explains how WebSocket connections are implemented in the CUET Rickshaw application.

## Overview

The application uses Socket.IO for real-time communication between students and drivers. WebSocket connections are established when users log in and are maintained throughout their session.

## Files Structure

```
hooks/
├── use-websocket.ts          # Main WebSocket hook
context/
├── WebSocketContext.tsx      # WebSocket context provider
components/
├── websocket-status.tsx      # Reusable status component
```

## WebSocket Hook (`use-websocket.ts`)

### Features
- **Automatic Connection**: Connects to `http://10.19.88.241:3000` with authentication
- **Reconnection**: Automatically reconnects with exponential backoff
- **Event Handling**: Listens for ride-related events
- **Type Safety**: Full TypeScript support

### Usage
```typescript
const { 
  isConnected, 
  events, 
  error, 
  sendRideRequest, 
  acceptRide, 
  declineRide,
  updateLocation 
} = useWebSocket(token, userType)
```

### Events Handled
- `ride_request` - New ride request from student
- `ride_accepted` - Driver accepted ride
- `ride_declined` - Driver declined ride
- `trip_started` - Trip has started
- `trip_completed` - Trip completed
- `payment_processed` - Payment completed
- `driver_status_update` - Driver status changed
- `driver_location` - Driver location updated

## Integration in Dashboards

### Rickshaw Dashboard
- **Connection Status**: Shows real-time WebSocket status
- **Ride Requests**: Receives and handles incoming ride requests
- **Location Updates**: Allows drivers to update their location
- **Ride Actions**: Accept/decline rides via WebSocket

### Student Dashboard
- **Connection Status**: Shows real-time WebSocket status
- **Ride Requests**: Sends ride requests to available drivers
- **Ride Responses**: Receives driver responses (accept/decline)
- **Trip Updates**: Gets real-time trip status updates

## WebSocket Status Component

The `WebSocketStatus` component provides a consistent way to display connection status across the application:

```typescript
<WebSocketStatus isConnected={isConnected} error={error} />
```

### Status Colors
- **Green**: Connected
- **Red**: Error
- **Gray**: Disconnected

## Authentication

WebSocket connections are authenticated using JWT tokens stored in localStorage:

```typescript
const token = localStorage.getItem('token')
const { isConnected } = useWebSocket(token, 'driver')
```

## Error Handling

The WebSocket implementation includes comprehensive error handling:
- Connection errors are logged and displayed
- Automatic reconnection on disconnection
- Graceful degradation when WebSocket is unavailable

## Real-time Features

### For Drivers
- Receive ride requests instantly
- Update location in real-time
- Accept/decline rides with immediate feedback
- Get trip status updates

### For Students
- Send ride requests to available drivers
- Receive driver responses immediately
- Track trip progress in real-time
- Get payment confirmations

## Testing

To test WebSocket functionality:
1. Open browser developer tools
2. Check console for connection logs
3. Monitor WebSocket status indicator in header
4. Test ride request/response flow between student and driver dashboards

## Troubleshooting

### Common Issues
1. **Connection Failed**: Check if the WebSocket server is running
2. **Authentication Error**: Verify token is valid and present
3. **Events Not Received**: Check event handlers are properly set up

### Debug Mode
Enable debug logging by checking browser console for WebSocket events and connection status. 