import { OnboardOS } from "../../../lib/src"

const FlowPreview = ({flowId}: {flowId: string}) => {
    return (
        <div className="w-full h-full">
            <OnboardOS flowId={flowId} />
        </div>
    )
}

export default FlowPreview