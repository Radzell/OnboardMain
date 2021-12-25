import React, { memo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Button from '@mui/material/Button';

export default memo(({ data, isConnectable }:{data: any, isConnectable: boolean}) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        {data.label}
      </div>
      <Button>
          Preview
      </Button>
      <Handle
        type="source"
        position={Position.Left}
        id="a"
        style={{ top: 10, background: '#555' }}
        isConnectable={isConnectable}
      />
      
    </>
  );
});