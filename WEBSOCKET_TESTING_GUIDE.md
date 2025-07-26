# WebSocket Testing Guide

This guide shows you how to verify that WebSocket connections are working properly in your CUET Rickshaw application.

## 🎯 Quick Verification Methods

### 1. **Visual Status Indicator**
Look at the header of any dashboard page:
- **🟢 Green "WS: Connected"** = WebSocket is working ✅
- **🔴 Red "WS: Error"** = Connection failed ❌
- **⚪ Gray "WS: Disconnected"** = Not connected ⚠️

### 2. **WebSocket Debug Panel**
Click the **"WebSocket Debug"** button in the bottom-right corner of any dashboard to open a detailed debug panel.

## 🔍 Detailed Testing Steps

### Step 1: Open Browser Developer Tools
1. Press `F12` or right-click → "Inspect"
2. Go to the **Console** tab
3. Look for WebSocket connection messages

### Step 2: Check Console Logs
You should see these messages when WebSocket connects:
```
✅ WebSocket connected successfully!
🔗 Connection ID: [some-id]
👤 User Type: driver (or student)
```

### Step 3: Use the Debug Panel
1. Click **"WebSocket Debug"** button (bottom-right)
2. Check the **Status** badge
3. View **Recent Events** list
4. Use test buttons:
   - **Test**: Check connection status
   - **Events**: Send test events
   - **State**: Show detailed socket state

### Step 4: Test Real-time Features

#### For Students:
1. Select a route from "Available Routes"
2. Click "Find Available Drivers"
3. Select a driver and send ride request
4. Check console for `📨 Received ride_request event`

#### For Drivers:
1. Toggle online/offline status
2. Click "Update Location" button
3. Check console for location updates
4. Look for incoming ride requests

## 🧪 Manual Testing Commands

Open browser console and run these commands:

### Test Connection
```javascript
// Check if WebSocket is connected
console.log('Connected:', window.socket?.connected)
console.log('Socket ID:', window.socket?.id)
```

### Send Test Events
```javascript
// Test ride request (if you're a student)
window.socket?.emit('ride_request', {
  studentId: 'test-1',
  driverId: 'test-2',
  pickup: 'Test Location',
  destination: 'Test Destination',
  fare: 100
})

// Test location update (if you're a driver)
window.socket?.emit('driver_location_update', {
  location: { lat: 23.7937, lng: 90.4066, address: 'CUET' }
})
```

## 🚨 Troubleshooting

### Connection Issues

**Problem**: "WS: Error" or "WS: Disconnected"
**Solutions**:
1. Check if server is running at `http://10.19.88.241:3000`
2. Verify your JWT token is valid
3. Check network connectivity
4. Look for CORS errors in console

**Problem**: No events received
**Solutions**:
1. Check if you're connected (green status)
2. Verify event handlers are set up
3. Check server-side event emission
4. Look for authentication errors

### Common Error Messages

```
❌ WebSocket disconnected: transport close
```
- Server went down or network issue

```
🚨 WebSocket error: [Error object]
```
- Authentication failed or server error

```
📨 Received ride_request event: [data]
```
- ✅ Working correctly!

## 📊 Monitoring WebSocket Health

### Real-time Indicators
- **Connection Status**: Always visible in header
- **Event Counter**: Shows in debug panel
- **Error Messages**: Displayed in debug panel
- **Console Logs**: Detailed connection info

### Performance Metrics
- **Connection Time**: Should be < 2 seconds
- **Reconnection**: Automatic with backoff
- **Event Latency**: Should be < 100ms
- **Error Rate**: Should be 0% for normal operation

## 🎯 Success Criteria

Your WebSocket is working correctly when:

1. ✅ **Status shows "Connected"** (green)
2. ✅ **Console shows connection success**
3. ✅ **Debug panel shows recent events**
4. ✅ **Real-time features work** (ride requests, location updates)
5. ✅ **No error messages** in console
6. ✅ **Automatic reconnection** works when disconnected

## 🔧 Advanced Testing

### Load Testing
```javascript
// Send multiple events quickly
for(let i = 0; i < 10; i++) {
  setTimeout(() => {
    window.socket?.emit('test_event', { count: i })
  }, i * 100)
}
```

### Stress Testing
```javascript
// Disconnect and reconnect multiple times
const testReconnection = async () => {
  window.socket?.disconnect()
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Reconnected:', window.socket?.connected)
}
```

## 📱 Mobile Testing

1. **Open mobile browser** or use device emulation
2. **Check WebSocket status** in header
3. **Test touch interactions** with debug panel
4. **Verify real-time updates** work on mobile
5. **Test network switching** (WiFi to mobile data)

## 🎉 Success!

When everything is working:
- You'll see green "Connected" status
- Real-time ride requests work instantly
- Location updates happen immediately
- No errors in console
- Debug panel shows active events

Your WebSocket implementation is ready for production! 🚀 