import type { Player } from "~/types/chat.interface";

export const setPlayer = (player: Player) => {
  const cookie = useCookie<Player | null>('player', {maxAge: 30000})

  cookie.value = player
}

export const unsetPlayer = () => {
  const player = useCookie<Player | null>('player')

  player.value = null
}

export const getPlayer = () => {
  const player = useCookie<Player | null>('player')
  
  return player
}

export const generatePlayerId = (playerName: string) => {
  return Date.now().toLocaleString().concat(playerName)
}