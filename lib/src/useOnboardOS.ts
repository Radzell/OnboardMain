import { useRef } from "react"


export interface RefObject {
    goForward: () => void
    startLoader: (message: string) => void
    stopLoader: () => void
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

    const startLoader = !!ref.current?.startLoader ? ref.current?.startLoader: (_message: string) => {}
    const stopLoader = !!ref.current?.stopLoader ? ref.current?.stopLoader: () => {}

    return {register: register, goForward: goForward, startLoader, stopLoader}
}