import React, { useRef, useState } from 'react';
import ReactFlow, { Node, Elements, removeElements, addEdge, MiniMap, ReactFlowProvider, Controls, Position, Connection, Edge } from 'react-flow-renderer';
import { ScreenMetaData } from '../../interfaces/GraphNode';
import Sidebar from './flowbuilder-sidebar';
import { v4 as uuidv4 } from 'uuid';

import './flowbuilder.module.css'
import FormNode from '../../nodes/FormNode';
import EntryNode from '../../nodes/EntryNode';
import Hotkeys from 'react-hot-keys';
import { useSnackBar } from '../snackbar';
import { AlertColor } from '@mui/material';


const nodeTypes = {
  formNode: FormNode,
  entryNode: EntryNode
}

const snapGrid = [20, 20];

const getId = () => uuidv4();

const initialElements: Elements = [
  {
    id: getId(),
    type: "entryNode",
    position: { x: 250, y: 50 },
    data: { label: `Entry`, formType: "entry" },
  }
];

export const FlowBuilderChart = () => {


  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params: Edge<any> | Connection) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance: React.SetStateAction<null>) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any; }; clientX: number; clientY: number; }) => {
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

  const snackbar = useSnackBar()

  const onKeyDown = (keyName: any, e: KeyboardEvent, _: any) => {
    console.log('onKeyDown', keyName, e, _)

    e?.preventDefault()

    console.log('onKeyDown', keyName)
    if(keyName === "alt+s" || keyName === "command+s" ) {
      // save
      snackbar.showSnackBar("Saving...", "info")
    }
  }

  return (
    <Hotkeys
      keyName="control+s,alt+s"
      onKeyDown={onKeyDown}
    >
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
    </Hotkeys>
  );
}