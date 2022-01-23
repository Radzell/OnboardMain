import * as React from 'react';

import { useState } from "react";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

import { TwitterPicker } from 'react-color';
import { useAppDispatch } from '../../app/hooks';
import { saveFlowSetting } from '../../reducers/flowChartSlice';
import { useSnackBar } from '../snackbar';




const SettingsDialog = ({ open, onDismiss, flowId }: { open: boolean, onDismiss: any, flowId: string }) => {

    const [name, setAppName] = useState<string>("")
    const [tagLine, setTagLine] = useState<string>("")
    const [isLoading, setLoading] = useState<boolean>(false)
    const [color, setColor] = useState<string>("#fff")
    const dispatch = useAppDispatch()
    const snackbar = useSnackBar()
    const onSubmit = async (e: any) => {
        e.preventDefault()
        if (!name || !tagLine) {
            return
        }
        setLoading(true)
        try {
            setLoading(false)

            dispatch(saveFlowSetting({flowId, name, tagLine, color }))
            snackbar.showSnackBar("Saving...", "info")

            onDismiss()

        } catch (e) {

        }
        setLoading(false)
    }

    const handleColorChange = (color:any) => {
        setColor(color.hex)
    }



    return (
        <>
            <Dialog
                open={open}
                onClose={onDismiss}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {
                    !isLoading &&
                    <>
                        <DialogTitle id="alert-dialog-title">
                            Settings
                        </DialogTitle>
                        <DialogContent>
                            <TextField margin="normal" fullWidth={true} onChange={e => setAppName(e.target.value)} label="App Name" variant="outlined" />
                            <TextField margin="normal" fullWidth={true} onChange={e => setTagLine(e.target.value)} label="Tag Line" variant="outlined" />
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="subtitle2"
                            >
                                Color
                            </Typography>
                            <TwitterPicker 
                                color={ color }
                                onChangeComplete={ handleColorChange} triangle={"hide"} 
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onDismiss}>Cancel</Button>
                            <Button onClick={onSubmit} autoFocus>
                                Save
                            </Button>
                        </DialogActions>
                    </>
                }
                {isLoading &&
                    <>
                        <CircularProgress />
                    </>}
            </Dialog>
        </>
    );
};




export type SettingContext = {
    openSettingDialog: (flowId: string) => void
    closeSettingDialog: () => void
    flowId: string
}

const SettingContext = React.createContext<SettingContext | null>(null);

const useFlowbuilderSetting = () => {
    const context = React.useContext(SettingContext)

    const openSettingDialog = !!context ? context.openSettingDialog : (flowId: string) => { }
    const closeSettingDialog = !!context ? context.closeSettingDialog : () => { }


    return { openSettingDialog, closeSettingDialog };
};



const FlowBuilderSettingProvider = ({ children }: { children: JSX.Element }) => {

    const [settingDialogOpen, setSettingDialogOpen] = React.useState(false);

    const [flowId, setFlowId] = React.useState<string>("")

    const openSettingDialog = (flowId: string) => {
        setSettingDialogOpen(true);
        setFlowId(flowId)
    }


    const closeSettingDialog = () => {
        setSettingDialogOpen(false);
        setFlowId("")
    }

    return (
        <SettingContext.Provider value={{ openSettingDialog, closeSettingDialog, flowId }}>
            <>
                <SettingsDialog
                    open={settingDialogOpen}
                    onDismiss={closeSettingDialog}
                    flowId={flowId}
                />

                {children}
            </>
        </SettingContext.Provider>
    );
};


export { FlowBuilderSettingProvider, useFlowbuilderSetting };