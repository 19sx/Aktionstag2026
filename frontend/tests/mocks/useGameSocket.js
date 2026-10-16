let registrierter_on_message_callback = null

export function useGameSocket(options = {}) {
  // Falls ein Objekt mit onMessage übergeben wurde:
  if (typeof options === 'object' && typeof options?.onMessage === 'function') {
    registrierter_on_message_callback = options.onMessage
  }

  return {
    isConnected: true,
    connect: (url, cb) => {
      if (typeof cb === 'function') {
        registrierter_on_message_callback = cb
      }
    },
    sendEvent: () => {}
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