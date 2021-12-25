import React, { memo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../app/hooks';
import { showPreviewOfNode } from '../reducers/uiSlice';

export default memo(({ data, isConnectable }: { data: any, isConnectable: boolean }) => {
  
  const dispatch = useAppDispatch()

  const showPreview = () => {
    dispatch(showPreviewOfNode(data.id))
  }
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Right}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div style={{border: '1px solid #777', padding: 8}}>
        <div>
          {data.label}
        </div>
        <Button onClick={showPreview} size="small" variant="contained">
          Preview
        </Button>
      </div>
      <Handle
        type="source"
        position={Position.Left}
        id="a"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />

    </>
  );
});