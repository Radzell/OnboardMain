import React from 'react';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';


const foreignObjectSize = 40;



export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    ...rest
}:{id: string, sourceX: any, sourceY: any, targetX: any, targetY: any, sourcePosition: any, targetPosition:any, style: any, markerEnd:any, data:any}) {
    console.log("rest",rest)

    const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        evt.stopPropagation();

        data.onDeleteClicked()
        
    };
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <body>
                    <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
                        ×
                    </button>
                </body>
            </foreignObject>
        </>
    );
}
