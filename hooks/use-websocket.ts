import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (token: string, userType: 'driver' | 'student') => {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!token) return;

        const newSocket = io('http://10.19.88.241:3000', {
            auth: { token },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            maxReconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setError(null);
            console.log('✅ WebSocket connected successfully!');
            console.log('🔗 Connection ID:', newSocket.id);
            console.log('👤 User Type:', userType);
        });

        newSocket.on('disconnect', (reason) => {
            setIsConnected(false);
            console.log('❌ WebSocket disconnected:', reason);
        });

        newSocket.on('error', (error) => {
            setError(error);
            console.error('🚨 WebSocket error:', error);
        });

        // Ride events
        const rideEvents = [
            'ride_request', 'ride_accepted', 'trip_started', 
            'trip_completed', 'payment_processed'
        ];

        rideEvents.forEach(eventType => {
            newSocket.on(eventType, (data) => {
                console.log(`📨 Received ${eventType} event:`, data);
                setEvents(prev => [...prev, { 
                    type: eventType, 
                    data, 
                    timestamp: new Date() 
                }]);
            });
        });

        // Status and location events
        newSocket.on('driver_status_update', (data) => {
            console.log('🚗 Driver status update:', data);
            setEvents(prev => [...prev, { 
                type: 'driver_status_update', 
                data, 
                timestamp: new Date() 
            }]);
        });

        newSocket.on('driver_location', (data) => {
            console.log('📍 Driver location update:', data);
            setEvents(prev => [...prev, { 
                type: 'driver_location', 
                data, 
                timestamp: new Date() 
            }]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    const updateLocation = useCallback((location: { lat: number; lng: number; address: string }) => {
        if (userType === 'driver' && socket && isConnected) {
            socket.emit('driver_location_update', { location });
        }
    }, [socket, isConnected, userType]);

    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    const sendRideRequest = useCallback((rideData: any) => {
        if (userType === 'student' && socket && isConnected) {
            socket.emit('ride_request', rideData);
        }
    }, [socket, isConnected, userType]);

    const acceptRide = useCallback((rideId: string) => {
        if (userType === 'driver' && socket && isConnected) {
            socket.emit('ride_accepted', { rideId });
        }
    }, [socket, isConnected, userType]);

    const declineRide = useCallback((rideId: string) => {
        if (userType === 'driver' && socket && isConnected) {
            socket.emit('ride_declined', { rideId });
        }
    }, [socket, isConnected, userType]);

    const startTrip = useCallback((rideId: string) => {
        if (userType === 'driver' && socket && isConnected) {
            socket.emit('trip_started', { rideId });
        }
    }, [socket, isConnected, userType]);

    const completeTrip = useCallback((rideId: string) => {
        if (userType === 'driver' && socket && isConnected) {
            socket.emit('trip_completed', { rideId });
        }
    }, [socket, isConnected, userType]);

    return {
        socket,
        isConnected,
        events,
        error,
        updateLocation,
        clearEvents,
        sendRideRequest,
        acceptRide,
        declineRide,
        startTrip,
        completeTrip
    };
}; 