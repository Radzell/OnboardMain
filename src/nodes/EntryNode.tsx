import React, { memo, useMemo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../app/hooks';
import { showPreviewOfNode } from '../reducers/uiSlice';

export default memo(({ data, id, isConnectable}: { data: any, id:string, isConnectable: boolean }) => {
  
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
          Entry
        </div>

      </div>
    
    </>
  );
});