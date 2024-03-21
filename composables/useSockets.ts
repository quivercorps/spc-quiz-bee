import { io, Socket } from 'socket.io-client';

const config = useRuntimeConfig()
type EventCallback<T> = (data: T) => void

export const useSocket = () => {
  const socket: Socket = io(config.public.baseURL)
  
  const onEvent = <T>(event: string, callback: EventCallback<T>) => {
    socket.on(event, callback)
  }

  const emitEvent = <T>(event: string, data: T, callback?: (response?: any) => void) => {
    socket.emit(event, data, callback)
  }

  const disconnectSocket = () => {
    socket.disconnect()
  }

  return {
    socket,
    onEvent,
    emitEvent,
    disconnectSocket,
  }
}
