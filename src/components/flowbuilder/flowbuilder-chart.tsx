import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { Node, Elements, removeElements, addEdge, MiniMap, useZoomPanHelper, ReactFlowProvider, Controls, Position, Connection, Edge, OnLoadParams } from 'react-flow-renderer';
import { ScreenMetaDataMap } from '../../interfaces/GraphNode';
import Sidebar from './flowbuilder-sidebar';
import { v4 as uuidv4 } from 'uuid';

import './flowbuilder.module.css'
import FormNode from '../../nodes/FormNode';
import EntryNode from '../../nodes/EntryNode';
import Hotkeys from 'react-hot-keys';
import { useSnackBar } from '../snackbar';
import { AlertColor, Button, ButtonGroup, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { saveFlow } from '../../reducers/flowChartSlice';
import { Menu, Transition } from '@headlessui/react'
import { FileMenu } from './flowbuilder-filemenu';
import { useFirestoreConnect } from 'react-redux-firebase'
import FlowBuilderHeader from './flowbuilder-header';
import FlowPreview from './flowbuilder-flowpreview';


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
  const flowId = "main-app_flow"

  const screen = useAppSelector(state => state.ui.screen)

  useFirestoreConnect([
    { collection: 'flows', doc: flowId } // or 'todos'
  ])


  const flow = useAppSelector(
    ({ firestore }): any => firestore.data.flows && firestore.data.flows[flowId]
  )

  const { transform } = useZoomPanHelper();

  useEffect(() => {
    if (flow) {
      const [x = 0, y = 0] = flow.position;
      setElements(flow.elements || []);
      transform({ x, y, zoom: flow.zoom || 0 });
    }
  }, [flowId, flow])

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams<any> | null>(null);
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params: Edge<any> | Connection) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance: OnLoadParams<any>) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any; }; clientX: number; clientY: number; }) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
    if(!reactFlowBounds){
      return
    }
    const formType = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance?.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });


    const screenMetaData = ScreenMetaDataMap[formType]
    const newNode = {
      id: getId(),
      type: screenMetaData.type,
      position,
      data: { label: `${screenMetaData.name}`, formType: formType },
    } as Node;

    setElements((es) => es.concat(newNode));
  };

  const snackbar = useSnackBar()
  const dispatch = useAppDispatch()


  const onKeyDown = (keyName: any, e: KeyboardEvent, _: any) => {
    console.log('onKeyDown', keyName, e, _)

    e?.preventDefault()

    console.log('onKeyDown', keyName)
    if (keyName === "alt+s" || keyName === "command+s") {
      // save
      const flow = reactFlowInstance?.toObject();

      if (flow) {

        dispatch(saveFlow({ flowId, flowNodes: flow }))
        snackbar.showSnackBar("Saving...", "info")
      } else {
        snackbar.showSnackBar("Error saving...", "error")

      }

    }
  }

  return (
    <Hotkeys
      keyName="control+s,alt+s"
      onKeyDown={onKeyDown}
    >
      <div className="dndflow flex h-full flex-col">
        <ReactFlowProvider>
          <div className="w-full h-full flex flex-col" ref={reactFlowWrapper}>
            <FlowBuilderHeader reactFlowInstance={reactFlowInstance} />
            {screen === "chart" && <ReactFlow
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
            </ReactFlow>}
            {screen === "preview" && <FlowPreview />}
          </div>
          {screen === "chart" && <Sidebar flowId={flowId} />}

        </ReactFlowProvider>
      </div>
    </Hotkeys>
  );
}