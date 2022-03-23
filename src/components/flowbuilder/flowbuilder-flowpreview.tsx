import { OnboardOS } from "../../../lib/src"
import { useOnboardOS } from "../../../lib/src/useOnboardOS"

const FlowPreview = ({apiKey}: {apiKey: string}) => {
    const osboard = useOnboardOS()

    const onValidate = (stepId: string , stepType: string, data: object) => {
        console.log('onValidate', stepId, stepType, data)
        osboard.goForward()
        return true
    }

    const onEnd = (data:object, schema:object) => {
        console.log("onEnd", data,schema)
    }

    return (
        <div className="w-full h-full">
            <OnboardOS onEnd={onEnd} register={osboard.register}  onValidate={onValidate} apiKey={apiKey} />
        </div>
    )
}

export default FlowPreview