import { ref, computed } from 'vue'
import api from '@/plugins/axios'

export interface Notification {
  id: number
  user_id: number
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  is_read: boolean
  read_at?: string
  created_at: string
  updated_at: string
}

const notifications = ref<Notification[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useNotifications() {
  const fetchNotifications = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/notifications')
      notifications.value = response.data.data || []
      return notifications.value
    } catch (err) {
      error.value = 'Failed to fetch notifications'
      console.error('Error fetching notifications:', err)
      notifications.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`)
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.is_read = true
        notification.read_at = new Date().toISOString()
      }
    } catch (err) {
      error.value = 'Failed to mark notification as read'
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read')
      notifications.value.forEach(notification => {
        notification.is_read = true
        notification.read_at = new Date().toISOString()
      })
    } catch (err) {
      error.value = 'Failed to mark all notifications as read'
      throw err
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`)
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete notification'
      throw err
    }
  }

  const unreadNotifications = computed(() =>
    notifications.value.filter(notification => !notification.is_read)
  )

  const readNotifications = computed(() =>
    notifications.value.filter(notification => notification.is_read)
  )

  const notificationsByType = computed(() => {
    const grouped: Record<string, Notification[]> = {}
    notifications.value.forEach(notification => {
      if (!grouped[notification.type]) {
        grouped[notification.type] = []
      }
      grouped[notification.type].push(notification)
    })
    return grouped
  })

  const totalCount = computed(() => notifications.value.length)
  const unreadCount = computed(() => unreadNotifications.value.length)

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadNotifications,
    readNotifications,
    notificationsByType,
    totalCount,
    unreadCount,
  }
}
