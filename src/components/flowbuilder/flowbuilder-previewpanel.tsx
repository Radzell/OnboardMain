import React, { useEffect, useMemo, useState } from "react";
import { useStoreState } from "react-flow-renderer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { ScreenPreviewDataMap } from "../../interfaces/GraphNode";
import { useSnackBar } from "../snackbar";
import { saveFlowForm } from "../../reducers/flowChartSlice";
import { useFirestoreConnect } from "react-redux-firebase";
import { Flow, FlowForm } from "../../app/store";

const Form = withTheme(Bootstrap4Theme)


const PreviewPanel = ({ flowId }: { flowId: string }) => {
    const selectedNodeId = useAppSelector((state) => state.ui.previewing)
    const [shouldValidate, setShouldValidate] = useState<boolean>(false)
    const [formData, setFormData] = useState({})
    const [optionA, setOptionA] = useState<string>()
    const [optionB, setOptionB] = useState<string>()
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()


    useFirestoreConnect([
        { collection: 'flows', doc: flowId },
        { collection: 'flowForms', doc: selectedNodeId}
    ])


    const flow: Flow | undefined = useAppSelector(
        ({ firestore }): any =>  {
            if(!firestore.data.flows) {
                return
            }

            if(!firestore.data.flows[flowId]) {
                return
            }

            return firestore.data.flows[flowId]    
        }
    )

    const flowForm: FlowForm | undefined = useAppSelector(
        ({ firestore }): any =>  {
            if(!firestore.data.flowForms || !selectedNodeId) {
                return
            }

            if(!firestore.data.flowForms[selectedNodeId]) {
                return
            }

            
            return firestore.data.flowForms[selectedNodeId]    
        }
    )

    useEffect(() => {
        setTitle(flowForm?.title ?? "")
        setDescription(flowForm?.description ?? "")
        setOptionA(flowForm?.optionA ?? "")
        setOptionB(flowForm?.optionB ?? "")

    },[flowForm])


    useEffect(() => {

        setShouldValidate(flowForm?.validate ?? false)
    }, [flowForm])

    const nodes = useStoreState((store) => store.nodes);

    const formNode = useMemo(() => {
        const foundNodes = nodes.filter(node => node.id == selectedNodeId)

        if (foundNodes.length == 0) {
            return null
        }

        return foundNodes[0]
    }, [selectedNodeId, nodes])


    const schemas = useMemo(() => {
        const schemaData = ScreenPreviewDataMap[formNode?.data.formType]
        if (!schemaData) {
            return
        }

        return schemaData
    }, [formNode])

    const snackbar = useSnackBar()
    const dispatch = useAppDispatch()

    const onSave = async () => {

        if(!selectedNodeId) {
            return
        }

        await dispatch(saveFlowForm({ flowFormId: selectedNodeId, flowForm: { ...formData, title, description, optionA, optionB, validate: shouldValidate } }))
        snackbar.showSnackBar("Saving...", "info")
    }

    const renderValidateSection = () => {
        if(formNode?.data?.formType === "button_screen" || formNode?.data?.formType === "welcome") {
            return
        }

        if((formNode?.type === "formNode") || formNode?.data?.formType === "create_or_join_org") {
            return <FormControlLabel control={<Checkbox defaultChecked checked={shouldValidate}  onChange={(e) => {
                setShouldValidate(e.target.checked)
            }} />} label="Validate" />
        }
    }


    const handleTitleChange = (event: { target: { name: any; value: any; }; }) => {
        setTitle(event.target.value)
    }


    const handleDescriptionChange = (event: { target: { name: any; value: any; }; }) => {
        setDescription(event.target.value)
    }




    const handleOptionAChange = (event: { target: { name: any; value: any; }; }) => {
        setOptionA(event.target.value)
    }
    const handleOptionBChange = (event: { target: { name: any; value: any; }; }) => {
        setOptionB(event.target.value)
    }

    const renderOrButtonSection = () => {
        if((formNode?.type === "orNode")) {
            return (
                <>
                    <TextField
                        style={{marginTop: 8, marginBottom: 8}}
                        disabled={false}
                        fullWidth
                        helperText="Please specify the text for Button A"
                        label="Button A"
                        name="optionA"
                        onChange={handleOptionAChange}
                        value={optionA}
                        variant="outlined"
                        defaultValue={flowForm?.optionA ?? "" }
                    />
                    <TextField
                        style={{marginTop: 8, marginBottom: 8}}
                        multiline={true}
                        disabled={false}
                        fullWidth
                        helperText="Please specify the text for Button B"
                        label="Option B"
                        name="optionB"
                        onChange={handleOptionBChange}
                        value={optionB}
                        variant="outlined"
                        defaultValue={flowForm?.optionB ?? "" }

                    />
                </>
            )
        }
    }

    const renderButtonSection = () => {

        if(formNode?.data?.formType !== "button_screen") {
            return
        }

        return <TextField
            style={{marginTop: 8, marginBottom: 8}}
            disabled={false}
            fullWidth
            helperText="Please specify the text for your Button"
            label="Button A"
            name="optionA"
            onChange={handleOptionAChange}
            value={optionA}
            variant="outlined"
            defaultValue={flowForm?.optionA ?? "" }
        />
    }

    const renderBasicInfoSection = () => {
        if((formNode?.type === "orNode" || formNode?.data?.formType === "button_screen")) {
            return (
                <>
                    <TextField
                        style={{marginTop: 8, marginBottom: 8}}
                        disabled={false}
                        fullWidth
                        helperText="Please specify the a title for your screen"
                        label="Title"
                        name="title"
                        onChange={handleTitleChange}
                        value={title}
                        variant="outlined"
                        defaultValue={flowForm?.title ?? "" }

                    />
                    <TextField
                        style={{marginTop: 8, marginBottom: 8}}
                        multiline={true}
                        disabled={false}
                        fullWidth
                        helperText="Please specify the a description for your screen"
                        label="Description"
                        name="description"
                        onChange={handleDescriptionChange}
                        value={description}
                        variant="outlined"
                        defaultValue={flowForm?.description ?? "" }

                    />
                </>
            )
        }
    }

    return (
        <div className="flex flex-col justify-between h-full w-full">
            <div className="flex full flex-col">
                <Typography>
                    {formNode?.data.label}
                </Typography>
                <Typography variant="h5" gutterBottom component="div">
                    Settings
                </Typography>
                <TextField
                        style={{marginTop: 8, marginBottom: 8}}
                        multiline={true}
                        disabled={true}
                        fullWidth
                        helperText="ID for this screen"
                        label="ID"
                        name="ID"
                        value={selectedNodeId}
                        variant="outlined"

                        defaultValue={selectedNodeId}

                />
                {renderBasicInfoSection()}
                {renderOrButtonSection()}
                {renderButtonSection()}

                {renderValidateSection()}

            </div>

            <div className="mt-16">
                <Button onClick={onSave} variant="contained" fullWidth={true} sx={{}}>
                    Save
                </Button>
            </div>

        </div>
    )
}

export default PreviewPanel;