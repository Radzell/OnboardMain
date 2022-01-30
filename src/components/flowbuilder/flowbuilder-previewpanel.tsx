import React, { DragEvent, useEffect, useMemo, useState } from "react";
import { useStoreState, useStoreActions } from "react-flow-renderer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button, Checkbox, Divider, FormControlLabel, Typography } from "@mui/material";

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
        console.log('setShouldValidate', flowForm?.validate)

        setShouldValidate(flowForm?.validate)
    }, [flowForm])

    const nodes = useStoreState((store) => store.nodes);

    const formNode = useMemo(() => {
        const foundNodes = nodes.filter(node => node.id == selectedNodeId)

        if (foundNodes.length == 0) {
            return null
        }

        return foundNodes[0]
    }, [selectedNodeId, nodes])

    console.log('nodes on board', nodes, selectedNodeId)
    console.log('formNode', formNode)

    const [formData, setFormData] = useState({})

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

        await dispatch(saveFlowForm({ flowFormId: selectedNodeId, flowForm: { ...formData, validate: shouldValidate } }))
        snackbar.showSnackBar("Saving...", "info")
    }

    const renderValidateSection = () => {

        if((formNode && schemas && schemas.dataSchema && schemas.uiSchema) || formNode?.data?.formType === "create_or_join_org") {
            return <FormControlLabel control={<Checkbox defaultChecked checked={shouldValidate}  onChange={(e) => {
                setShouldValidate(e.target.checked)
            }} />} label="Validate" />
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