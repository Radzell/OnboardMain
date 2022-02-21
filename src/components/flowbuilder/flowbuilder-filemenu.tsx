import React, { createContext, useContext } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import { useStoreState } from 'react-flow-renderer';
import ReactFlow, { Node, Elements, removeElements, addEdge, MiniMap, ReactFlowProvider, Controls, Position, Connection, Edge, OnLoadParams } from 'react-flow-renderer';
import { useAppDispatch } from '../../app/hooks';
import { deployFlow, saveFlow } from '../../reducers/flowChartSlice';
import { useSnackBar } from '../snackbar';
import { useFlowbuilderSetting } from './flowbuilder-settings';


export const FileMenu = ({ flowId, reactFlowInstance }: { flowId: string, reactFlowInstance?: OnLoadParams<any> | null }) => {

    const dispatch = useAppDispatch()
    const snackbar = useSnackBar()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleSave = () => {
        const flow = reactFlowInstance?.toObject();
        if (flow) {
            dispatch(saveFlow({ flowId, flowNodes: flow }))
            snackbar.showSnackBar("Saving...", "info")
        } else {
            snackbar.showSnackBar("Error saving...", "error")
        }

        handleClose()
    }

    const settings = useFlowbuilderSetting()

    const handleSetting = () => {
        settings.openSettingDialog(flowId)
        setAnchorEl(null);
    }

    const handleDeploy = () => {
        dispatch(deployFlow({ flowId }))
        snackbar.showSnackBar("Deploying flow to production..", "info")

        handleClose()
    }

    return (
        <div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleDeploy}>Deploy</MenuItem>
                <MenuItem onClick={handleSave}>Save</MenuItem>
                <MenuItem onClick={handleSetting}>Settings</MenuItem>
            </Menu>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                File
            </Button>

        </div>
    )
}