import { Button, ButtonGroup, Divider } from "@mui/material"
import { OnLoadParams } from "react-flow-renderer"
import { useDispatch } from "react-redux"
import { useAppDispatch,  useAppSelector } from "../../app/hooks"
import { screenChartClicked, screenPreviewClicked } from "../../reducers/uiSlice"
import { FileMenu } from "./flowbuilder-filemenu"

const FlowBuilderHeader = ({ reactFlowInstance }: { reactFlowInstance: OnLoadParams<any> | null }) => {
    const flowId = "main-app_flow"

    const screen = useAppSelector(state => state.ui.screen)

    const dispatch = useAppDispatch()

    return (
        <>
            <div className="flex flex-row w-full justify-between item-center pt-2 pb-2">
                <FileMenu flowId={flowId} reactFlowInstance={reactFlowInstance} />
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => dispatch(screenChartClicked())} variant={screen === "chart" ? "contained" : "outlined"}>Chart</Button>
                    <Button onClick={() => dispatch(screenPreviewClicked())}  variant={screen === "preview" ? "contained" : "outlined"}>Preview</Button>
                </ButtonGroup>
                <div />

            </div>

            <Divider />
        </>
    )
}

export default FlowBuilderHeader