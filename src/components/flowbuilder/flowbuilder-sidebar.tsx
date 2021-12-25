import React from 'react';
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { previewClick, screenClick } from '../../reducers/uiSlice';
import ScreensPanel from './flowbuilder-screenspanel';
import PreviewPanel from './flowbuilder-previewpanel';

const Sidebar = () => {
  

  const tab =   useAppSelector((state) => state.ui.tab)
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
    <aside style={{ width: '500px', backgroundColor: '#E5E7EB' }} className="flex flex-col items-center">

      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button onClick={changeTab('screens')} variant={tab === 'screens' ? "contained" : "outlined"}>Screens</Button>
        <Button onClick={changeTab('preview')} variant={tab === 'preview' ? "contained" : "outlined"}>Preview</Button>
      </ButtonGroup>
      {tab === 'screens' && <ScreensPanel />}
      {tab === 'preview' && <PreviewPanel />}

    </aside>


  );
};

export default Sidebar;