import { ref, onUnmounted } from 'vue'

export function useGameSocket(optionsOrUrl = {}) {
  const isConnected = ref(false)
  const error = ref(null)
  let socket = null
  let messageQueue = []

  let defaultUrl = typeof optionsOrUrl === 'string' ? optionsOrUrl : optionsOrUrl?.url || null
  let defaultOnMessage = typeof optionsOrUrl === 'object' ? optionsOrUrl?.onMessage : null

  const sendEvent = (event, payload = {}) => {
    const msgString = JSON.stringify({ event, payload })
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msgString)
    } else if (socket && socket.readyState === WebSocket.CONNECTING) {
      messageQueue.push(msgString)
    } else {
      console.warn('[SOCKET] Verbindung nicht offen. readyState:', socket?.readyState)
    }
  }

  const sendMessage = (payload) => {
    const msgString = typeof payload === 'string' ? payload : JSON.stringify(payload)
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msgString)
    } else if (socket && socket.readyState === WebSocket.CONNECTING) {
      messageQueue.push(msgString)
    } else {
      console.warn('[SOCKET] Verbindung nicht offen.')
    }
  }

  const connect = (urlOrCallback, onMessageCallback, onOpenCallback) => {
    let targetUrl = defaultUrl
    let onMsg = defaultOnMessage
    let onOpen = null

    console.warn("Logging in")

    if (typeof urlOrCallback === 'string') {
      targetUrl = urlOrCallback
      if (typeof onMessageCallback === 'function') {
        onMsg = onMessageCallback
      }
      if (typeof onOpenCallback === 'function') {
        onOpen = onOpenCallback
      }
    } else if (typeof urlOrCallback === 'function') {
      onMsg = urlOrCallback
      if (typeof onMessageCallback === 'function') {
        onOpen = onMessageCallback
      }
    }

    if (!targetUrl) {
      console.error('[SOCKET] Keine WebSocket-URL angegeben.')
      return
    }

    if (socket) {
      socket.onclose = null
      socket.onerror = null
      socket.close()
      socket = null
    }

    try {
      socket = new WebSocket(targetUrl)

      socket.onopen = () => {
        console.log(`[SOCKET] Verbunden mit: ${targetUrl}`)
        isConnected.value = true
        error.value = null

        // Vorab eingereihte Nachrichten senden
        while (messageQueue.length > 0) {
          const queued = messageQueue.shift()
          socket.send(queued)
        }

        if (typeof onOpen === 'function') {
          onOpen()
        }
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (typeof onMsg === 'function') {
            onMsg(data)
          }
        } catch (e) {
          console.error('[SOCKET] Fehler beim Parsen der WebSocket-Nachricht:', e, event.data)
        }
      }

      socket.onclose = () => {
        console.log('[SOCKET] Verbindung geschlossen')
        isConnected.value = false
      }

      socket.onerror = (err) => {
        console.error('[SOCKET] WebSocket-Fehler:', err)
        error.value = 'CONNECTION_ERROR'
        isConnected.value = false
      }
    } catch (err) {
      console.error('[SOCKET] Verbindungsaufbau fehlgeschlagen:', err)
      error.value = 'CONNECTION_ERROR'
      isConnected.value = false
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
      socket = null
    }
    isConnected.value = false
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendEvent,
    sendMessage
  }
}

export function simulateMessage(payload) {
  if (typeof registrierter_on_message_callback !== 'function') {
    throw new Error('Kein onMessage registriert. Die Vue-Komponente muss useGameSocket({ onMessage }) aufrufen.')
  }
  registrierter_on_message_callback(payload)
}

export function resetGameSocketMock() {
  registrierter_on_message_callback = null
}
