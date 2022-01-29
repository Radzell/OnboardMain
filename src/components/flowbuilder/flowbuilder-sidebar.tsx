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
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const Sidebar = ({ flowId }: { flowId: string }) => {

  const [open, setOpen] = useState(true)

  const tab = useAppSelector((state) => state.ui.tab)
  const dispatch = useAppDispatch()
  const changeTab = (newTab: 'preview' | 'screens') => {
    return () => {
      if (newTab === 'screens') {
        dispatch(screenClick())
      }
      if (newTab === 'preview') {
        dispatch(previewClick())
      }
    }
  }

  const onCloseClicked = () =>{
    setOpen(false)
  }

  return (

    <Transition.Root show={open} as={Fragment}>
      <aside style={{ width: '500px', backgroundColor: '#E5E7EB' }} className="flex flex-col items-center">
        <div className="w-full, justify-between">
          <IconButton onClick={onCloseClicked} >
            <CloseIcon />
          </IconButton>
          <ButtonGroup style={{ marginRight: "auto", marginLeft: "auto" }} variant="outlined" aria-label="outlined button group">
            <Button onClick={changeTab('screens')} variant={tab === 'screens' ? "contained" : "outlined"}>Screens</Button>
            <Button onClick={changeTab('preview')} variant={tab === 'preview' ? "contained" : "outlined"}>Settings</Button>
          </ButtonGroup>
          <div />
        </div>

        {tab === 'screens' && <ScreensPanel />}
        {tab === 'preview' && <PreviewPanel flowId={flowId} />}

      </aside>

    </Transition.Root>
  );
};

export default Sidebar;