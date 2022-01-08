import { DragEvent } from "react";
import { ScreenMetaDataMap, ScreenType } from "../../interfaces/GraphNode";

const ScreensPanel = () => {
    const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };

    return (
        <>
            <div className="description">You can drag these screens to the pane on the left.</div>


            {Object.values(ScreenType).filter(nodetype => nodetype !== "entry").map(nodetype => {
                return (
                    <div key={nodetype} className="react-flow__node-default" onDragStart={(event) => onDragStart(event, nodetype)} draggable>
                        {ScreenMetaDataMap[nodetype].name}
                    </div>
                )
            })}
        </>
    )
}

export default ScreensPanel;