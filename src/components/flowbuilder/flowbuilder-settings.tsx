import * as React from 'react';

import { useEffect, useState } from "react";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField, Typography } from '@mui/material';

import { TwitterPicker } from 'react-color';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteFlowLogo, saveFlowSetting } from '../../reducers/flowChartSlice';
import { useSnackBar } from '../snackbar';
import { useFirestoreConnect } from 'react-redux-firebase'
import { Flow } from '../../app/store';
import { useDropzone } from 'react-dropzone';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFirebase } from 'react-redux-firebase'

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const dropzoneCss = {
    flex: 1,
    display: 'flex',
    "flex-direction": 'column',
    "align-items": 'center',
    "padding": 20,
    "border-width": 2,
    "border-radius": 2,
    "border-color": '#eeeeee',
    "border-style": "dashed",
    "background-color": "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"
}

const closeButton = {
    position: 'absolute',
    left: '0%',
    top: '0%',

}


const SettingsDialog = ({ open, onDismiss, flowId }: { open: boolean, onDismiss: any, flowId: string }) => {
    const [file, setFile] = useState<{file: File} & { preview: string; }>();
    const [defaultFile, setDefaultFile] = useState<string>()

    useFirestoreConnect([
        { collection: 'flows', doc: flowId } // or 'todos'
    ])

    const onDeleteLogo = () => {
        console.log('onDeleteLogo',flow.logoName)

        setFile(undefined)
        setDefaultFile(undefined)
        if(flow.logoName) {
            dispatch(deleteFlowLogo({flowId, logoName: flow.logoName}))
        }
    }

    const thumbs = () => {
        if (!file && !defaultFile) {
            return
        }

        return (
            <div className="flex items-center">
                <div style={thumb} key={file?.name}>

                    <div style={thumbInner}>
                        <img
                            src={file?.preview ?? defaultFile}
                            style={img}
                        />
                    </div>
                </div>
                <div>
                    <Button onClick={onDeleteLogo} variant="contained">Delete Logo</Button>
                </div>
            </div>
        )
    }

    const flow: Flow = useAppSelector(
        ({ firestore }): any => firestore.data.flows && firestore.data.flows[flowId]
    )

    const firebase = useFirebase()

    useEffect(() => {
        const defaultFlow = async () => {
            if (flow) {

                setAppName(flow.name)
                setColor(flow.color)
                setTagLine(flow.tagLine)
                if(flow.logoName) {
                    
                    const downloadUrl = await firebase.storage().ref(`images/${flow.logoName}`).getDownloadURL()
                    setDefaultFile(downloadUrl)
                }
            }
        }
        defaultFlow()
    }, [flow])

    const [name, setAppName] = useState<string | undefined>("")
    const [tagLine, setTagLine] = useState<string | undefined>("")
    const [isLoading, setLoading] = useState<boolean>(false)
    const [color, setColor] = useState<string>("#fff")
    const dispatch = useAppDispatch()
    const snackbar = useSnackBar()



    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                const file = acceptedFiles[0]
                console.log('file onDrop', { ...file, preview: URL.createObjectURL(file) })
                setFile({ file, preview: URL.createObjectURL(file) })
            }

        }
    })

    const onSubmit = async (e: any) => {
        e.preventDefault()
        if (!name) {
            snackbar.showSnackBar("Name Required", "error")
            return
        }
        setLoading(true)
        try {
            setLoading(false)
            
            dispatch(saveFlowSetting({ flowId, name, tagLine, color, file: file?.file }))

            snackbar.showSnackBar("Saving...", "info")

            onDismiss()

        } catch (e) {
            console.error("flow save error", e)

            snackbar.showSnackBar("Error Saving...", "error")

        }
        setLoading(false)
    }

    const handleColorChange = (color: any) => {
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
                            <TextField margin="normal" defaultValue={name} fullWidth={true} onChange={e => setAppName(e.target.value)}
                                label="App Name" variant="outlined" />
                            <TextField margin="normal" defaultValue={tagLine} fullWidth={true} onChange={e => setTagLine(e.target.value)}
                                label="Tag Line" variant="outlined" />
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="subtitle2"
                            >
                                Color
                            </Typography>
                            <TwitterPicker
                                color={color}
                                onChangeComplete={handleColorChange} triangle={"hide"}
                            />
                            <Divider style={{ marginTop: 8 }} />
                            <section style={{ marginTop: 8 }}>
                                <Typography
                                    color="textPrimary"
                                    gutterBottom
                                    variant="subtitle2"
                                >
                                    Logo
                                </Typography>
                                {!file && !defaultFile &&
                                    <div style={dropzoneCss} {...getRootProps({})}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some your logo here, or click to select a file</p>
                                    </div>
                                }
                                <aside style={thumbsContainer}>
                                    {thumbs()}
                                </aside>
                            </section>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onDismiss}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={onSubmit} autoFocus>
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