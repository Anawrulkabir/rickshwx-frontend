# WebSocket Server Setup Guide

## Quick Setup

To resolve the SocketContext TypeScript errors and enable real-time notifications, you need to set up a WebSocket server.

### Option 1: Simple Node.js WebSocket Server

1. **Create a new directory for the server:**
```bash
mkdir websocket-server
cd websocket-server
npm init -y
```

2. **Install dependencies:**
```bash
npm install socket.io express cors
npm install --save-dev @types/node @types/express @types/cors
```

3. **Create `server.js`:**
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://10.19.88.241:3004",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const connectedUsers = new Map();
const activeRides = new Map();

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Register user
  socket.on('register_user', (userData) => {
    connectedUsers.set(socket.id, userData);
    socket.emit('registration_success', { message: 'User registered successfully' });
    console.log('👤 User registered:', userData);
  });

  // Create ride request (from student)
  socket.on('create_ride_request', (rideData) => {
    const user = connectedUsers.get(socket.id);
    if (user?.role === 'student') {
      const rideId = `ride_${Date.now()}`;
      activeRides.set(rideId, {
        ...rideData,
        studentId: user.userId,
        status: 'pending',
        timestamp: new Date().toISOString()
      });

      // Notify all available drivers
      connectedUsers.forEach((userData, userId) => {
        if (userData.role === 'rickshaw') {
          io.to(userId).emit('ride_request_notification', {
            type: 'ride_request_notification',
            rideId,
            title: 'New Ride Request',
            message: `${user.name} wants a ride from ${rideData.pickupLocation} to ${rideData.destination}`,
            studentName: user.name,
            pickupLocation: rideData.pickupLocation,
            destination: rideData.destination,
            estimatedFare: rideData.estimatedFare,
            timestamp: new Date().toISOString()
          });
        }
      });

      socket.emit('ride_request_created', { rideId });
      console.log('🚗 Ride request created:', rideId);
    }
  });

  // Driver responds to ride
  socket.on('respond_to_ride', ({ rideId, action }) => {
    const user = connectedUsers.get(socket.id);
    if (user?.role === 'rickshaw') {
      const ride = activeRides.get(rideId);
      if (ride) {
        ride.status = action === 'accept' ? 'accepted' : 'declined';
        ride.driverId = user.userId;

        // Notify student
        const studentSocket = Array.from(connectedUsers.entries())
          .find(([_, userData]) => userData.userId === ride.studentId)?.[0];
        
        if (studentSocket) {
          io.to(studentSocket).emit('ride_accepted', {
            type: 'ride_response',
            title: action === 'accept' ? 'Ride Accepted!' : 'Ride Declined',
            message: action === 'accept' 
              ? 'Your ride request has been accepted by the driver. They\'re on the way!'
              : 'Your ride request was declined. Please try another driver.',
            timestamp: new Date().toISOString()
          });
        }

        socket.emit('ride_acceptance_confirmed', {
          destination: ride.destination,
          action
        });

        console.log('✅ Ride response:', action, rideId);
      }
    }
  });

  // Update driver availability
  socket.on('update_availability', ({ isAvailable }) => {
    const user = connectedUsers.get(socket.id);
    if (user?.role === 'rickshaw') {
      user.isAvailable = isAvailable;
      console.log('🔄 Driver availability updated:', isAvailable);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
```

4. **Start the server:**
```bash
node server.js
```

### Option 2: Use the Existing Notification System

If you prefer to use the existing notification system without WebSocket:

1. **Update SocketContext to use localStorage-based notifications:**
   - The current notification system already works with localStorage
   - No WebSocket server needed
   - Real-time simulation through polling

### Option 3: Fix TypeScript Issues Only

To fix the TypeScript errors without setting up WebSocket:

1. **Update SocketContext.tsx:**
```typescript
// Replace Socket type with any for now
interface SocketContextType {
    socket: any | null
    // ... rest of the interface
}
```

## Testing the System

1. **Start the WebSocket server** (if using Option 1)
2. **Start the Next.js app:**
```bash
npm run dev
```
3. **Open student dashboard** and create a ride request
4. **Open driver dashboard** in another tab to see notifications
5. **Test the notification system** at `/test-notifications`

## Current Status

✅ **Notification system implemented** with localStorage
✅ **UI components aligned** and styled
✅ **Data structures defined**
⚠️ **WebSocket server optional** - can use existing notification system
⚠️ **TypeScript errors** in SocketContext (can be fixed with proper types)

The application is fully functional with the current notification system! 