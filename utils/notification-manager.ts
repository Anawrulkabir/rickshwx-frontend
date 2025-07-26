// Types for notifications
export interface Notification {
  id: string
  type: 'ride_request' | 'ride_response' | 'system'
  title: string
  message: string
  data?: any
  timestamp: string
  read: boolean
}

export interface RideRequest {
  id: string
  studentId: string
  driverId: string
  student: {
    name: string
    phone: string
  }
  pickup: string
  destination: string
  fare: number
  distance: string
  status: 'pending' | 'accepted' | 'declined'
  timestamp: string
}

class NotificationManager {
  private readonly NOTIFICATIONS_KEY = 'cuet_rickshaw_notifications'
  private readonly RIDE_REQUESTS_KEY = 'cuet_rickshaw_ride_requests'

  // Get all notifications for a user
  getNotifications(userId: string): Notification[] {
    try {
      const notifications = localStorage.getItem(`${this.NOTIFICATIONS_KEY}_${userId}`)
      return notifications ? JSON.parse(notifications) : []
    } catch (error) {
      console.error('Error getting notifications:', error)
      return []
    }
  }

  // Add a new notification
  addNotification(userId: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    try {
      const notifications = this.getNotifications(userId)
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        read: false
      }
      
      notifications.unshift(newNotification) // Add to beginning
      localStorage.setItem(`${this.NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(notifications))
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }

  // Mark notification as read
  markAsRead(userId: string, notificationId: string): void {
    try {
      const notifications = this.getNotifications(userId)
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
      localStorage.setItem(`${this.NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(updatedNotifications))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Get unread notifications count
  getUnreadCount(userId: string): number {
    const notifications = this.getNotifications(userId)
    return notifications.filter(notification => !notification.read).length
  }

  // Ride request management
  createRideRequest(request: Omit<RideRequest, 'id' | 'timestamp'>): RideRequest {
    const newRequest: RideRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    }

    // Store the ride request
    try {
      const requests = this.getRideRequests()
      requests.push(newRequest)
      localStorage.setItem(this.RIDE_REQUESTS_KEY, JSON.stringify(requests))
    } catch (error) {
      console.error('Error creating ride request:', error)
    }

    // Add notification for driver
    this.addNotification(request.driverId, {
      type: 'ride_request',
      title: 'New Ride Request',
      message: `${request.student.name} wants a ride from ${request.pickup} to ${request.destination}`,
      data: newRequest
    })

    return newRequest
  }

  // Get all ride requests
  getRideRequests(): RideRequest[] {
    try {
      const requests = localStorage.getItem(this.RIDE_REQUESTS_KEY)
      return requests ? JSON.parse(requests) : []
    } catch (error) {
      console.error('Error getting ride requests:', error)
      return []
    }
  }

  // Get pending ride requests for a driver
  getPendingRequestsForDriver(driverId: string): RideRequest[] {
    const requests = this.getRideRequests()
    return requests.filter(request => 
      request.driverId === driverId && request.status === 'pending'
    )
  }

  // Accept or decline a ride request
  respondToRideRequest(requestId: string, driverId: string, status: 'accepted' | 'declined'): void {
    try {
      const requests = this.getRideRequests()
      const requestIndex = requests.findIndex(req => req.id === requestId)
      
      if (requestIndex !== -1) {
        requests[requestIndex].status = status
        
        // Update localStorage
        localStorage.setItem(this.RIDE_REQUESTS_KEY, JSON.stringify(requests))
        
        const request = requests[requestIndex]
        
        // Add notification for student
        this.addNotification(request.studentId, {
          type: 'ride_response',
          title: status === 'accepted' ? 'Ride Accepted!' : 'Ride Declined',
          message: status === 'accepted' 
            ? `Your ride request has been accepted by the driver. They're on the way!`
            : `Your ride request was declined. Please try another driver.`,
          data: { requestId, status, driverId }
        })
      }
    } catch (error) {
      console.error('Error responding to ride request:', error)
    }
  }

  // Clear old notifications (older than 7 days)
  clearOldNotifications(userId: string): void {
    try {
      const notifications = this.getNotifications(userId)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      const filteredNotifications = notifications.filter(notification => 
        new Date(notification.timestamp) > sevenDaysAgo
      )
      
      localStorage.setItem(`${this.NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(filteredNotifications))
    } catch (error) {
      console.error('Error clearing old notifications:', error)
    }
  }
}

export const notificationManager = new NotificationManager() 