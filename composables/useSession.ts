export const useSession = () => {
    const session = useCookie<string | null>('session')

    const setSession = (access_token: string) => {
        session.value = access_token
        refreshCookie('session')
    }

    const unsetSession = () => {
        session.value = null
        refreshCookie('session')
    }

    const getSession = () => {
        return session.value
    }

    return {
        setSession,
        unsetSession,
        getSession
    }
}