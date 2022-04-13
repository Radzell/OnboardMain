import { OnboardOS } from "../../../lib/src"
import { useOnboardOS } from "../../../lib/src/useOnboardOS"
import { useAppSelector } from "../../app/hooks"

const FlowPreview = ({apiKey, testApiKey}: {apiKey: string, testApiKey: string}) => {

    const isPreviewTest = useAppSelector((state) => state.ui.isPreviewTest)

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
            <OnboardOS trackAnalytics={false} onAction={onAction} onEnd={onEnd} register={osboard.register} onValidate={onValidate} apiKey={isPreviewTest ? testApiKey : apiKey} testing={isPreviewTest} />
        </div>
    )
}

export default FlowPreview