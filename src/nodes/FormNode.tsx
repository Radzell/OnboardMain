import React, { memo, useMemo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { showPreviewOfNode } from '../reducers/uiSlice';
import { openSidebar } from '../reducers/flowChartSlice';
import { Typography } from '@mui/material';

export default memo(({ data, id, isConnectable}: { data: any, id:string, isConnectable: boolean }) => {
  

  const flowForms = useAppSelector(
    ({ firestore }): any => {
      return firestore.data.allFlowForms  ?? {}
    }
  )



  const flowForm = useMemo(() => {
    if(!id || !flowForms || !flowForms[id]) {
      return
    }

    return flowForms[id]
  },[flowForms, id])
  
  const dispatch = useAppDispatch()

  const showPreview = () => {
    dispatch(openSidebar())

    dispatch(showPreviewOfNode(id))
  }

  console.log("FormNode", data)

  const renderName = () => {

    if(data.formType === "end_point") {
      return "End Point"
    }
    return flowForm?.name ?? "Untitled"
  }
  
  return (
    <>
      
      <Handle
        type="source"
        position={Position.Right}
        
        style={{ 
          background: '#555', 
          width: 25, 
          height: 'calc(100% + 2px)', 
          right: -24,
          borderRadius: '0px 10px 10px 0px'  
        }}
        isConnectable={isConnectable}
      />
      <div style={{border: '1px solid #777', padding: 8}}>
        <Typography variant="subtitle1" >
          {renderName()}
        </Typography >
        {data.formType !== "end_point" &&
          <Typography variant="caption" component="div">
          {data.label}
          </Typography >
        }
        {data.formType !== "end_point" && <Button onClick={showPreview} size="small" variant="contained">
          Preview
        </Button>
        }
      </div>
      
      <Handle
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