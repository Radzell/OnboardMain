import { OnboardOS } from "../../../lib/src"

const FlowPreview = ({flowId}: {flowId: string}) => {
    return (
        <div>
            <OnboardOS flowId={flowId} />
        </div>
    )
}

export default FlowPreview