export const setUser = ({ id, name }: { id: string; name: string }) => {
    const user = useCookie<{userId: string; userName: string} | null>('user')

    user.value = {
        userId: id,
        userName: name
    }
  }
  
  export const unsetUser = () => {
    const user = useCookie<{userId: string; userName: string} | null>('user')

    user.value = null
  }
  
  export const getUser = () => {
    const user = useCookie<{userId: string; userName: string} | null>('user')
    
    const userId = user.value?.userId
    const userName = user.value?.userName
    return {
      userId,
      userName,
    }
  }
  
  export const generateUserId = (userName: string) => {
    return Date.now().toLocaleString().concat(userName)
  }