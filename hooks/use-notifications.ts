import { useState, useEffect, useCallback } from 'react'
import { notificationManager, Notification } from '@/utils/notification-manager'

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)

  // Load notifications
  const loadNotifications = useCallback(() => {
    const userNotifications = notificationManager.getNotifications(userId)
    setNotifications(userNotifications)
    setUnreadCount(notificationManager.getUnreadCount(userId))
  }, [userId])

  // Check for new notifications
  const checkForNewNotifications = useCallback(() => {
    const userNotifications = notificationManager.getNotifications(userId)
    const unreadNotifications = userNotifications.filter(n => !n.read)
    
    // If there are unread notifications and no current notification is showing
    if (unreadNotifications.length > 0 && !currentNotification) {
      const latestUnread = unreadNotifications[0]
      setCurrentNotification(latestUnread)
    }
    
    setNotifications(userNotifications)
    setUnreadCount(unreadNotifications.length)
  }, [userId, currentNotification])

  // Close current notification
  const closeNotification = useCallback(() => {
    setCurrentNotification(null)
  }, [])

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    notificationManager.markAsRead(userId, notificationId)
    loadNotifications()
  }, [userId, loadNotifications])

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    notificationManager.clearOldNotifications(userId)
    loadNotifications()
  }, [userId, loadNotifications])

  // Poll for new notifications every 3 seconds
  useEffect(() => {
    loadNotifications()
    
    const interval = setInterval(() => {
      checkForNewNotifications()
    }, 3000)

    return () => clearInterval(interval)
  }, [loadNotifications, checkForNewNotifications])

  return {
    notifications,
    unreadCount,
    currentNotification,
    closeNotification,
    markAsRead,
    clearAllNotifications,
    checkForNewNotifications
  }
} 