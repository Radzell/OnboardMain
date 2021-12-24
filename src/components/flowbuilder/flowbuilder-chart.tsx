import React, { useRef, useState } from 'react';
import ReactFlow,  {Node, Elements, removeElements, addEdge,   MiniMap, ReactFlowProvider, Controls, Position} from 'react-flow-renderer';
import { GraphNode } from 'src/interfaces/GraphNode';
import Sidebar from './flowbuilder-sidebar';
import './flowbuilder.module.css'

const initialElements:  Elements = [
  {
    id: '1',
    type: 'input',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    data: { label: 'Another Node' },
    position: { x: 100, y: 125 },
  },
];

  
  let id = 0;
  const getId = () => `dndnode_${id++}`;

export const FlowBuilderChart = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const onConnect = (params) => setElements((els) => addEdge(params, els));
    const onElementsRemove = (elementsToRemove) =>
      setElements((els) => removeElements(elementsToRemove, els));
  
    const onLoad = (_reactFlowInstance) =>
      setReactFlowInstance(_reactFlowInstance);
  
    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };
  
    const onDrop = (event) => {
      event.preventDefault();
  
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
  
      setElements((es) => es.concat(newNode));
    };
  
    return (
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              elements={elements}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <Controls />
            </ReactFlow>
          </div>
          <Sidebar />
        </ReactFlowProvider>
      </div>
    );
}