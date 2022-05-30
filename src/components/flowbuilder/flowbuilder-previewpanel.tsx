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
import Ajv, {ErrorObject as AJVErrorObject} from 'ajv';
import { TwitterPicker } from "react-color";

const ajv = new Ajv({
    allErrors: true,
    multipleOfPrecision: 8,
    schemaId: undefined,
})

ajv.addVocabulary(["clientId", "scope", "redirectUri", "text"])

const PreviewPanel = ({ flowId, type }: { flowId: string, type: 'design' | 'setting' }) => {
    const selectedNodeId = useAppSelector((state) => state.ui.previewing)
    const [shouldValidate, setShouldValidate] = useState<boolean>(false)
    const [formData, setFormData] = useState({})
    const [optionA, setOptionA] = useState<string>()
    const [optionB, setOptionB] = useState<string>()
    const [title, setTitle] = useState<string>()
    const [name, setName] = useState<string>()
    const [titleColor, setTitleColor] = useState<string>()
    const [descriptionColor, setDescriptionColor] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [schema, setSchema] = useState<string>()
    const [schemaError, setSchemaError] = useState<boolean>(false)


    useFirestoreConnect([
        { collection: 'flows', doc: flowId },
        { collection: `flowForms`, doc: flowId, subcollections: [{collection: "forms", doc: selectedNodeId}], storeAs: 'currentFlowForm' }
    ])



    const flowForm: FlowForm | undefined = useAppSelector(
        ({ firestore }): any =>  {

            if(!firestore.data.currentFlowForm || !selectedNodeId) {
                return
            }

            
            return firestore.data.currentFlowForm 
        }
    )

    const flow: Flow | undefined = useAppSelector(
        ({ firestore }): any =>  {
            if(!firestore.data.flows || !selectedNodeId) {
                return
            }
         
            return firestore.data.flows[flowId] ?? undefined
        }
    )

    useEffect(() => {
        setTitle(flowForm?.title ?? "")
        setDescription(flowForm?.description ?? "")
        setOptionA(flowForm?.optionA ?? "")
        setOptionB(flowForm?.optionB ?? "")
        setName(flowForm?.name ?? "Untitled")
        setSchema(flowForm?.schema ?? "")
        setTitleColor(flowForm?.titleColor ?? (flow?.color ?? "#000"))
        setDescriptionColor(flowForm?.descriptionColor ?? "#000")


    },[flowForm, flow])


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



    const snackbar = useSnackBar()
    const dispatch = useAppDispatch()

    const onSave = async () => {
        let schemaSaving = schema
        if(!selectedNodeId) {
            return
        }
        if(formNode?.data?.formType === "custom_form_screen") {
            try {
                validateSchema(schemaSaving ?? "")

                const schemaObj = JSON.parse(schemaSaving ?? "")

                delete schemaObj["title"]
                delete schemaObj["description"]

                schemaSaving = JSON.stringify(schemaObj)
    

            }catch(e) {
                snackbar.showSnackBar("Invalid Schema", "error")
                return
            }
        }

        await dispatch(saveFlowForm({ flowId, flowFormId: selectedNodeId, flowForm: { ...formData, title, description, optionA, optionB, name, schema: schemaSaving, titleColor, descriptionColor,  validate: shouldValidate } }))
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

    const handleNameChange = (event: { target: { name: any; value: any; }; }) => {
        setName(event.target.value)
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

    const handleSchemaChange = (event: { target: { name: any; value: any; }; }) => {
        
        setSchema(event.target.value)

        try{

            validateSchema(event.target.value);
            setSchemaError(false)
        }catch(e) {
            console.error("schema error",e)
            setSchemaError(true)
        }

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
        if((formNode?.type === "orNode" || formNode?.data?.formType === "button_screen" || formNode?.data?.formType === "custom_form_screen")) {
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


    const renderBasicInfoDesignSection = () => {
        if((formNode?.type === "orNode" || formNode?.data?.formType === "button_screen" || formNode?.data?.formType === "custom_form_screen")) {
            return (
                <>
                    <Typography>
                        Title Color
                    </Typography>
                    <TwitterPicker onChange={(e) => {
                        setTitleColor(e.hex)
                    }} color={titleColor} triangle="hide" />
                     <Typography>
                        Description Color
                    </Typography>
                    <TwitterPicker onChange={(e) => {
                        setDescriptionColor(e.hex)
                    }} color={descriptionColor} triangle="hide" />
                </>
            )
        }
    }

    const renderStepName = () => {
        return <TextField
            style={{marginTop: 8, marginBottom: 8}}
            disabled={false}
            fullWidth
            helperText="Please specify the a title for your step"
            label="Name"
            name="name"
            onChange={handleNameChange}
            value={name}
            variant="outlined"
            defaultValue={flowForm?.name ?? "Untitled" }

        />
    }

    const renderCustomFormSection = () => {
        return(
            <TextField
                maxRows={4}
                error={schemaError}
                id="outlined-textarea"
                label="Form Schema"
                placeholder="schema"
                style={{marginTop: 8, marginBottom: 8}}
                disabled={false}
                fullWidth
                helperText="Add a valid json schema for your custom form"
                name="schema"
                onChange={handleSchemaChange}
                value={schema}
                variant="outlined"
                defaultValue={flowForm?.schema ?? "Untitled" }
                multiline
            />
        )
    }

    const renderPreviewFormItems = () => {
        if(type != 'setting'){
            return <></>
        }
        return <>
                {renderStepName()}
                {renderBasicInfoSection()}
                {renderOrButtonSection()}
                {renderButtonSection()}
                {renderCustomFormSection()}
                {renderValidateSection()}
        </>
    }

    const renderDesignFormItems = () => {
        if(type != 'design'){
            return <></>
        }
        return <>
                {renderBasicInfoDesignSection()}
               
        </>
    }

    return (
        <div className="relative flex flex-col justify-between max-h-screen w-full -scroll-ml-0">
                <Typography>
                    {formNode?.data.label}
                </Typography>
                <Typography variant="h5" gutterBottom component="div">
                    Settings
                </Typography>
            <div className="flex max-h-screen h-full flex-col overflow-y-scroll scroll-pb-4 mb-40 ">

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
                {renderPreviewFormItems()}
                {renderDesignFormItems()}
                
            </div>            
   

            <div style={{width: 300}} className="fixed bottom-8 mt-16 ">
                <Button onClick={onSave} variant="contained" fullWidth={true} sx={{}}>
                    Save
                </Button>
            </div>

        </div>
    )
}

export default PreviewPanel;

function validateSchema(str: string) {
    const parsedJson = JSON.parse(str);
    ajv.compile(parsedJson);
}
