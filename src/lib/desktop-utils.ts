import { StudentData } from '../lib/types'

// Utility functions for desktop application

export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}

export const showDesktopNotification = (title: string, body: string): void => {
  if (isElectron()) {
    // Use Electron's notification system
    new Notification(title, { body })
  } else {
    // Fallback for web
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  }
}

export const saveDataLocally = async (key: string, data: any): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data))
    }
  } catch (error) {
    console.error('Failed to save data locally:', error)
  }
}

export const loadDataLocally = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    }
    return defaultValue
  } catch (error) {
    console.error('Failed to load data locally:', error)
    return defaultValue
  }
}

export const clearLocalData = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error('Failed to clear local data:', error)
  }
}

export const exportFeedbackData = async (data: any): Promise<void> => {
  if (isElectron()) {
    try {
      const result = await window.electronAPI.showSaveDialog()
      if (!result.canceled && result.filePath) {
        // Convert data to CSV format
        const csv = convertToCSV(data)
        // In a real implementation, you'd use Node.js fs module via IPC
        console.log('Export to:', result.filePath, csv)
      }
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  } else {
    // Fallback for web - download as file
    downloadAsFile(data, 'feedback-data.json')
  }
}

const convertToCSV = (data: any[]): string => {
  if (!data.length) return ''
  
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(item => 
    Object.values(item).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  )
  
  return [headers, ...rows].join('\n')
}

const downloadAsFile = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const validateStudentData = (data: StudentData): string[] => {
  const errors: string[] = []
  
  if (!data.joiningYear?.trim()) errors.push('Joining Year is required')
  if (!data.branch?.trim()) errors.push('Branch is required')
  if (!data.year?.trim()) errors.push('Academic Year is required')
  if (!data.section?.trim()) errors.push('Section is required')
  if (!data.registrationNumber?.trim()) errors.push('Registration Number is required')
  
  return errors
}

export const formatStudentInfo = (data: StudentData): string => {
  return `${data.registrationNumber} - ${data.joiningYear} ${data.branch} ${data.year} ${data.section}`
}

export const getAppVersion = async (): Promise<string> => {
  if (isElectron()) {
    try {
      return await window.electronAPI.getAppVersion()
    } catch (error) {
      console.error('Failed to get app version:', error)
      return '1.0.0'
    }
  }
  return '1.0.0'
}
