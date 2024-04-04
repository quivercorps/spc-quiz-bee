import { io, Socket } from 'socket.io-client'

type EventCallback<T> = (data: T) => void

export const useSocket = () => {
  const config = useRuntimeConfig()
  const socket: Socket = io(config.public.baseURL, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    autoConnect: false
  })
  
  const onEvent = <T>(event: string, callback: EventCallback<T>) => {
    socket.on(event, callback)
  }

  const emitEvent = <T>(event: string, data: T, callback?: (response?: any) => void) => {
    if (callback) {
      socket.emit(event, data, callback);
    } else {
      socket.emit(event, data);
    }
  }

  const disconnectSocket = () => {
    socket.disconnect()
  }

  const connectSocket = () => {
    socket.connect()
  }

  return {
    socket,
    connectSocket,
    onEvent,
    emitEvent,
    disconnectSocket,
  }
}
