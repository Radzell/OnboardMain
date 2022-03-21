import React, { memo, useMemo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../app/hooks';
import { showPreviewOfNode } from '../reducers/uiSlice';

export default memo(({ data, id, isConnectable}: { data: any, id:string, isConnectable: boolean }) => {
  
  const dispatch = useAppDispatch()

  const showPreview = () => {
    dispatch(showPreviewOfNode(id))
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
        <div>
          {data.label}
        </div>
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