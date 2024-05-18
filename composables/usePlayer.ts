export const setPlayer = ({ id, name }: { id: string; name: string }) => {
  const player = useCookie<{playerId: string; playerName: string} | null>('player', {maxAge: 3000})

  player.value = {
      playerId: id,
      playerName: name
  }
}

export const unsetPlayer = () => {
  const player = useCookie<{playerId: string; playerName: string} | null>('player')

  player.value = null
}

export const getPlayer = () => {
  const player = useCookie<{playerId: string; playerName: string} | null>('player')
  
  const playerId = player.value?.playerId
  const playerName = player.value?.playerName
  return {
    playerId,
    playerName,
  }
}

export const generatePlayerId = (playerName: string) => {
  return Date.now().toLocaleString().concat(playerName)
}