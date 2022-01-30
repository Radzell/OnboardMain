import { OnboardOS } from "../../../lib/src"
import { useOnboardOS } from "../../../lib/src/useOnboardOS"

const FlowPreview = ({flowId}: {flowId: string}) => {
    const osboard = useOnboardOS()

    const onValidate = () => {
        osboard.goForward()
        return true
    }

    const onEnd = (data:object, schema:object) => {
        console.log("onEnd", data,schema)
    }

    return (
        <div className="w-full h-full">
            <OnboardOS onEnd={onEnd} register={osboard.register}  onValidate={onValidate} flowId={flowId} />
        </div>
    )
}

export default FlowPreview