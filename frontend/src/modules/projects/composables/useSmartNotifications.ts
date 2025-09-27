import { ref, computed } from 'vue'
import type { Project, ProjectPhase, Enquiry } from '../types'

interface Notification {
  id: string
  type: 'task_assignment' | 'deadline' | 'bottleneck' | 'completion' | 'delay'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

export function useSmartNotifications() {
  const notifications = ref<Notification[]>([])

  // Generate notifications based on project state
  const generateNotifications = (project: Project, enquiry: Enquiry) => {
    const newNotifications: Notification[] = []

    if (!project || !project.phases) return newNotifications

    const now = new Date()

    project.phases.forEach((phase, index) => {
      // Deadline notifications
      if (phase.status === 'In Progress' || phase.status === 'Not Started') {
        const startDate = project.start_date ? new Date(project.start_date) : new Date()
        const deadline = new Date(startDate)
        deadline.setDate(startDate.getDate() + phase.estimatedDuration)

        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilDeadline <= 3 && daysUntilDeadline > 0) {
          newNotifications.push({
            id: `deadline-${phase.id}`,
            type: 'deadline',
            title: 'Upcoming Deadline',
            message: `${phase.name} is due in ${daysUntilDeadline} day${daysUntilDeadline > 1 ? 's' : ''}`,
            priority: daysUntilDeadline === 1 ? 'urgent' : 'high',
            timestamp: new Date(),
            read: false,
            actionUrl: `/projects/${project.id}/phase/${index}`,
            metadata: { phaseId: phase.id, daysLeft: daysUntilDeadline }
          })
        } else if (daysUntilDeadline < 0) {
          newNotifications.push({
            id: `overdue-${phase.id}`,
            type: 'delay',
            title: 'Phase Overdue',
            message: `${phase.name} is ${Math.abs(daysUntilDeadline)} days overdue`,
            priority: 'urgent',
            timestamp: new Date(),
            read: false,
            actionUrl: `/projects/${project.id}/phase/${index}`,
            metadata: { phaseId: phase.id, daysOverdue: Math.abs(daysUntilDeadline) }
          })
        }
      }

      // Task assignment notifications (mock)
      if (phase.status === 'Not Started' && index === 0) {
        newNotifications.push({
          id: `assignment-${phase.id}`,
          type: 'task_assignment',
          title: 'New Task Assigned',
          message: `You have been assigned to ${phase.name}`,
          priority: 'medium',
          timestamp: new Date(),
          read: false,
          actionUrl: `/projects/${project.id}/phase/${index}`,
          metadata: { phaseId: phase.id, assignedBy: 'System' }
        })
      }

      // Completion notifications
      if (phase.status === 'Completed') {
        const existingNotification = notifications.value.find(n => n.id === `completion-${phase.id}`)
        if (!existingNotification) {
          newNotifications.push({
            id: `completion-${phase.id}`,
            type: 'completion',
            title: 'Phase Completed',
            message: `${phase.name} has been completed successfully`,
            priority: 'low',
            timestamp: new Date(),
            read: false,
            metadata: { phaseId: phase.id }
          })
        }
      }
    })

    // Add bottleneck notifications
    const bottlenecks = detectBottlenecks(project)
    bottlenecks.forEach(bottleneck => {
      const existingNotification = notifications.value.find(n => n.id === `bottleneck-${bottleneck.id}`)
      if (!existingNotification) {
        newNotifications.push({
          id: `bottleneck-${bottleneck.id}`,
          type: 'bottleneck',
          title: 'Workflow Bottleneck Detected',
          message: bottleneck.description,
          priority: bottleneck.severity === 'critical' ? 'urgent' : 'high',
          timestamp: new Date(),
          read: false,
          actionUrl: `/projects/${project.id}/bottlenecks`,
          metadata: bottleneck
        })
      }
    })

    return newNotifications
  }

  // Simple bottleneck detection (could be enhanced)
  const detectBottlenecks = (project: Project) => {
    const bottlenecks = []
    const now = new Date()

    project.phases.forEach(phase => {
      if (phase.status === 'In Progress') {
        const startDate = project.start_date ? new Date(project.start_date) : new Date()
        const expectedEndDate = new Date(startDate)
        expectedEndDate.setDate(startDate.getDate() + phase.estimatedDuration)

        if (now > expectedEndDate) {
          const delay = Math.ceil((now.getTime() - expectedEndDate.getTime()) / (1000 * 60 * 60 * 24))
          bottlenecks.push({
            id: phase.id,
            phase: phase.name,
            description: `${phase.name} is ${delay} days overdue`,
            severity: delay > 7 ? 'critical' : 'high'
          })
        }
      }
    })

    return bottlenecks
  }

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    notifications.value.unshift(newNotification)
    return newNotification
  }

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }

  // Remove notification
  const removeNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Get notifications by type
  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.value.filter(n => n.type === type)
  }

  // Get unread notifications
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read)
  })

  // Get urgent notifications
  const urgentNotifications = computed(() => {
    return notifications.value.filter(n => n.priority === 'urgent' && !n.read)
  })

  // Get notifications count
  const notificationsCount = computed(() => {
    return notifications.value.length
  })

  const unreadCount = computed(() => {
    return unreadNotifications.value.length
  })

  return {
    notifications,
    unreadNotifications,
    urgentNotifications,
    notificationsCount,
    unreadCount,
    generateNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getNotificationsByType
  }
}
