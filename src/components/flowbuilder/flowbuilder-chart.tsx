import React, { useRef, useState } from 'react';
import ReactFlow, { Node, Elements, removeElements, addEdge, MiniMap, ReactFlowProvider, Controls, Position } from 'react-flow-renderer';
import { ScreenMetaData } from '../../interfaces/GraphNode';
import Sidebar from './flowbuilder-sidebar';
import { v4 as uuidv4 } from 'uuid';

import './flowbuilder.module.css'
import FormNode from '../../nodes/FormNode';



const nodeTypes = {
  formNode: FormNode,
}

const snapGrid = [20, 20];

const getId = () => uuidv4();

const initialElements: Elements = [
  {
    id: getId(),
    type: "input",
    position: { x: 250, y: 0 },
    data: { label: `Entry`, formType: "entry" },
  }
];

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
    const formType = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });


    const screenMetaData = ScreenMetaData[formType]
    const newNode = {
      id: getId(),
      type: screenMetaData.type,
      position,
      data: { label: `${screenMetaData.name}`, formType: formType },
    };

    setElements((es) => es.concat(newNode));
  };

  return (
    <div className="dndflow flex h-full flex-col">
      <ReactFlowProvider>
        <div className="w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            snapToGrid={true}
            nodeTypes={nodeTypes}

          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
}