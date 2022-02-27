import { Button, ButtonGroup, Divider, IconButton } from "@mui/material"
import { OnLoadParams } from "react-flow-renderer"
import { useDispatch } from "react-redux"
import { useAppDispatch,  useAppSelector } from "../../app/hooks"
import { toggleSidebar } from "../../reducers/flowChartSlice"
import { screenChartClicked, screenPreviewClicked } from "../../reducers/uiSlice"
import { FileMenu } from "./flowbuilder-filemenu"
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useRouter } from "next/router"

const FlowBuilderHeader = ({ reactFlowInstance }: { reactFlowInstance: OnLoadParams<any> | null }) => {
    const router = useRouter()
    const { flowId }: {flowId: string} = router.query
    const screen = useAppSelector(state => state.ui.screen)
    const flowSideOpen = useAppSelector((state) => state.flowChart.flowSideOpen)

    const dispatch = useAppDispatch()

    const onSideBarOpen = () => {
        dispatch(toggleSidebar())
    }

    const displayNone = flowSideOpen ? "none" : ""

    return (
        <>
            <div className="flex flex-row w-full justify-between item-center pt-2 pb-2 h-16 items-center pl-4 pr-4">
                <FileMenu flowId={flowId} reactFlowInstance={reactFlowInstance} />
                <div className="w-full flex justify-center h-8 items-center">
                    <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                        <Button onClick={() => dispatch(screenChartClicked())} variant={screen === "chart" ? "contained" : "outlined"}>Chart</Button>
                        <Button onClick={() => dispatch(screenPreviewClicked())}  variant={screen === "preview" ? "contained" : "outlined"}>Preview</Button>
                    </ButtonGroup>
                </div>
                
                { <IconButton style={{"display": displayNone}} onClick={onSideBarOpen} className=""><MenuOpenIcon /></IconButton>}

            </div>

            <Divider />
        </>
    )
}

export default FlowBuilderHeader