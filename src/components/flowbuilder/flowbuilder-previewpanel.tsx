import React, { DragEvent, useMemo, useState } from "react";
import { useStoreState, useStoreActions } from "react-flow-renderer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button, Typography } from "@mui/material";

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { ScreenPreviewData } from "../../interfaces/GraphNode";
import { useSnackBar } from "../snackbar";
import { saveFlowForm } from "../../reducers/flowChartSlice";
import { useFirestoreConnect } from "react-redux-firebase";
import { Flow } from "../../app/store";

const Form = withTheme(Bootstrap4Theme)

const emailDataSchema = {
    type: 'object',
    title: '',
    properties: {
        email: {
            title: 'Email',
            type: 'string'
        },
        password: {
            title: 'Password',
            type: 'string'
        }
    },
    dependencies: {},
    required: [
        'email'
    ]
}

const emailUiSchema = {
    password: {
        'ui:widget': 'password'
    },
    'ui:order': [
        'email',
        'password'
    ]
}

const welcomeUIschema = {

    "type": "VerticalLayout"

}

const PreviewPanel = ({ flowId }: { flowId: string }) => {

    useFirestoreConnect([
        { collection: 'flows', doc: flowId } // or 'todos'
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

    const selectedNodeId = useAppSelector((state) => state.ui.previewing)
    const nodes = useStoreState((store) => store.nodes);
    const transform = useStoreState((store) => store.transform);
    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

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
        const schemaData = ScreenPreviewData[formNode?.data.formType]
        if (!schemaData) {
            return
        }

        return schemaData
    }, [formNode])

    const snackbar = useSnackBar()
    const dispatch = useAppDispatch()

    const onSave = async () => {

        await dispatch(saveFlowForm({ flowFormId: selectedNodeId, flowForm: formData }))
        snackbar.showSnackBar("Saving...", "info")
    }

    const appColor = flow && flow.color ? flow.color : "#fff"

    return (
        <div className="flex flex-col justify-between h-full w-full">
            <div className="flex full flex-col">
                {formNode && schemas && <Typography variant="h5" gutterBottom component="div">
                    {schemas.name}
                </Typography>}
                {formNode && schemas && schemas.dataSchema && schemas.uiSchema && <Form
                    schema={schemas.dataSchema}
                    uiSchema={schemas.uiSchema}
                    onChange={(newFormData) => setFormData(newFormData.formData)}
                    formData={formData}
                    readonly={true}
                    submitButtonMessage="Login"
                />}
                {formNode?.data.formType === "welcome" && <div style={{backgroundColor: appColor}} className="flex h-full w-full">
                    <Typography variant="h6">{flow.name}</Typography>
                </div>
                }
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