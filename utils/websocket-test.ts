// WebSocket Test Utilities

export const testWebSocketConnection = (socket: any) => {
  if (!socket) {
    console.log('❌ No socket instance found')
    return false
  }

  console.log('🔍 Testing WebSocket connection...')
  console.log('📊 Socket connected:', socket.connected)
  console.log('🆔 Socket ID:', socket.id)
  console.log('🔗 Socket URL:', socket.io.uri)

  return socket.connected
}

export const testWebSocketEvents = (socket: any) => {
  if (!socket) {
    console.log('❌ No socket instance found')
    return
  }

  console.log('🧪 Testing WebSocket events...')
  
  // Test emit
  socket.emit('test_event', { message: 'Hello from client!' })
  console.log('📤 Sent test event')

  // Test custom event
  socket.emit('ping', { timestamp: Date.now() })
  console.log('🏓 Sent ping event')
}

export const logWebSocketState = (socket: any) => {
  if (!socket) {
    console.log('❌ No socket instance found')
    return
  }

  console.log('📋 WebSocket State:')
  console.log('  Connected:', socket.connected)
  console.log('  ID:', socket.id)
  console.log('  Disconnected:', socket.disconnected)
  console.log('  Transport:', socket.io.engine.transport.name)
  console.log('  Ready State:', socket.io.readyState)
}

export const createTestRideRequest = () => {
  return {
    studentId: 'test-student-1',
    driverId: 'test-driver-1',
    pickup: 'Test Pickup Location',
    destination: 'Test Destination',
    fare: 100,
    distance: '2.5 km',
    timestamp: new Date().toISOString()
  }
} 