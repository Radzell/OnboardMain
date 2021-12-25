import React from 'react';
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { previewClick, screenClick } from '../../reducers/uiSlice';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const [open, setOpen] = useState(true)

  const tab =   useAppSelector((state) => state.counter.tab)
  const dispatch = useAppDispatch()
  const changeTab = (newTab: 'preview'| 'screens') => {
    return () => {
      if(newTab === 'screens') {
        dispatch(screenClick())
      }
      if(newTab === 'preview') {
        dispatch(previewClick())
      }
    }
  }

  return (
    <aside style={{ width: '400px' }} className="bg-gray-800 flex flex-col items-center">

      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button onClick={changeTab('screens')} variant={tab === 'screens' ? "contained" : "outlined"}>Screens</Button>
        <Button onClick={changeTab('preview')} variant={tab === 'preview' ? "contained" : "outlined"}>Preview</Button>
      </ButtonGroup>
      <div className="description">You can drag these screens to the pane on the left.</div>
      <div className="react-flow__node-input" onDragStart={(event) => onDragStart(event, 'entry')} draggable>
        Entry
      </div>
      <div className="react-flow__node-default" onDragStart={(event) => onDragStart(event, 'welcome')} draggable>
        Welcome Flow
      </div>
      <div className="react-flow__node-output" onDragStart={(event) => onDragStart(event, 'email_and_password')} draggable>
        Email and Password
      </div>
    </aside>


  );
};

export default Sidebar;