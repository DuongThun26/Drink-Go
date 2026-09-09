const WS_URL = import.meta.env.VITE_WS_URL

class NotificationService {
  constructor() {
    this.socket = null
    this.listeners = new Set()
  }

  connect(token) {
    if (!WS_URL || this.socket) return

    this.socket = new WebSocket(`${WS_URL}?token=${token}`)

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.listeners.forEach((fn) => fn(data))
      } catch {
        /* ignore malformed messages */
      }
    }

    this.socket.onclose = () => {
      this.socket = null
    }
  }

  disconnect() {
    this.socket?.close()
    this.socket = null
  }

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }
}

export const notificationService = new NotificationService()
