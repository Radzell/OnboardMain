import React, { memo, useMemo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../app/hooks';
import { showPreviewOfNode } from '../reducers/uiSlice';
import { Typography } from '@mui/material';
import { openSidebar } from '../reducers/flowChartSlice';

export default memo(({ data, id, isConnectable }: { data: any, id: string, isConnectable: boolean }) => {
    const dispatch = useAppDispatch()

    const showPreview = () => {
        dispatch(showPreviewOfNode(id))
        dispatch(openSidebar())

    }
    return (
        <>

            <Handle
                type="source"
                position={Position.Right}
                id="optionA"
                style={{
                    background: '#555',
                    width: 25,
                    height: 'calc(30% + 2px)',
                    right: -24,
                    top: 12,
                    borderRadius: '0px 10px 10px 0px'
                }}
                isConnectable={isConnectable}
            >
                <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center",pointerEvents:'none' }}>
                    <Typography color="#fff" style={{ fontWeight: "bold" }} variant='body2'>A</Typography>
                </div>
            </Handle>

            <Handle
                id="optionB"
                type="source"
                position={Position.Right}
                style={{
                    background: '#555',
                    width: 25,
                    height: 'calc(30% + 2px)',
                    right: -24,
                    top: 65,
                    borderRadius: '0px 10px 10px 0px'
                }}
                isConnectable={isConnectable}
            >
                <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents:'none' }}>
                    <Typography style={{ fontWeight: "bold" }} color="#fff" variant='body2'>B</Typography>
                </div>
            </Handle>
            <div style={{ border: '1px solid #777', padding: 8 }}>
                <div>
                    {data.label}
                </div>
                {data.formType !== "end_point" && <Button onClick={showPreview} size="small" variant="contained">
                    Preview
                </Button>
                }
            </div>

            <Handle
                id="or-target"
                type="target"
                position={Position.Left}
                style={{
                    background: '#555',
                    left: -14,
                    height: 18,
                    width: 15,
                    borderRadius: '8px 0px 0px 8px'
                }}
                isConnectable={isConnectable}
            />
        </>
    );
});