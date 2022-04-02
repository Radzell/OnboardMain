import { OnboardOS } from "../../../lib/src"
import { useOnboardOS } from "../../../lib/src/useOnboardOS"

const FlowPreview = ({apiKey}: {apiKey: string}) => {

    const osboard = useOnboardOS()

    const onValidate = async (stepId: string , stepType: string, data: object) => {
        osboard.goForward()
        return true
    }

    const onEnd = (data:object, schema:object) => {
    }

    const onAction = (stepId: string , stepType: string, data: object) => {

    }

    return (
        <div className="w-full h-full">
            <OnboardOS onAction={onAction} onEnd={onEnd} register={osboard.register} onValidate={onValidate} apiKey={apiKey} />
        </div>
    )
}

export default FlowPreview