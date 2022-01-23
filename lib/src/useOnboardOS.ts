import { useRef } from "react"


export interface RefObject {
    goForward: () => void
}

export interface RegisterReturn {
    ref: React.MutableRefObject<RefObject | undefined>
}

export const useOnboardOS = () => {
    const ref = useRef< RefObject>()
    
    const register = () => {
        return {ref}
    }

    const goForward = !!ref.current?.goForward ? ref.current?.goForward : () => {}

    return {register: register, goForward: goForward}
}