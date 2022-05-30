import React from 'react';
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { previewClick, screenClick, designClick } from '../../reducers/uiSlice';
import ScreensPanel from './flowbuilder-screenspanel';
import PreviewPanel from './flowbuilder-previewpanel';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { toggleSidebar } from '../../reducers/flowChartSlice';

const Sidebar = ({ flowId }: { flowId: string }) => {


  const tab = useAppSelector((state) => state.ui.tab)
  const flowSideOpen = useAppSelector((state) => state.flowChart.flowSideOpen)

  const dispatch = useAppDispatch()
  const changeTab = (newTab: 'preview' | 'screens' | 'design') => {
    return () => {
      if (newTab === 'screens') {
        dispatch(screenClick())
      }
      if (newTab === 'preview') {
        dispatch(previewClick())
      }

      if (newTab === 'design') {
        dispatch(designClick())
      }
    }
  }

  const onCloseClicked = () =>{
    dispatch(toggleSidebar())
  }

  return (

    <Transition.Root show={flowSideOpen} as={Fragment}>
      <aside style={{ width: '500px', backgroundColor: '#E5E7EB' }} className="flex flex-col items-center">
        <div className="w-full justify-between">
          <IconButton className="fixed left-0" onClick={onCloseClicked} >
            <CloseIcon />
          </IconButton>
          <ButtonGroup style={{ marginRight: "auto", marginLeft: "auto" }} variant="outlined" aria-label="outlined button group">
            <Button onClick={changeTab('screens')} variant={tab === 'screens' ? "contained" : "outlined"}>Screens</Button>
            <Button onClick={changeTab('preview')} variant={tab === 'preview' ? "contained" : "outlined"}>Settings</Button>
            <Button onClick={changeTab('design')} variant={tab === 'design' ? "contained" : "outlined"}>Design</Button>

          </ButtonGroup>
          <div />
        </div>

        {tab === 'screens' && <ScreensPanel />}
        {tab === 'preview' && <PreviewPanel type={"setting"} flowId={flowId} />}
        {tab === 'design' && <PreviewPanel type={"design"}  flowId={flowId} />}

      </aside>

    </Transition.Root>
  );
};

export default Sidebar;