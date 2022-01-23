import { OnboardOS } from "../../../lib/src"
import { useOnboardOS } from "../../../lib/src/useOnboardOS"

const FlowPreview = ({flowId}: {flowId: string}) => {
    const osboard = useOnboardOS()

    const onValidate = () => {
        osboard.goForward()
        return true
    }
    return (
        <div className="w-full h-full">
            <OnboardOS register={osboard.register} onValidate={onValidate} flowId={flowId} />
        </div>
    )
}

export default FlowPreview