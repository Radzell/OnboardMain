import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage'


export const getSession = async () => {
    return await localforage.getItem<string>("sessionId")
}

export const createOrGetSession = async () => {
    const oldSession = await getSession()
    if(oldSession) {
        return oldSession
    }
    const sessionId = uuidv4()

    await localforage.setItem("sessionId", sessionId)

    return sessionId
}


export const trackEvent =  async (event) => {

    try{
        const sessionId = await createOrGetSession()

        fetch("https://us-central1-onboard-os.cloudfunctions.net/trackEvent", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({...event, sessionId })
        }).catch((e) => {})
    }catch(e) {

    }
    
}
