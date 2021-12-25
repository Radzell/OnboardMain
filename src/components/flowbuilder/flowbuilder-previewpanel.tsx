import React, { DragEvent, useMemo, useState } from "react";
import { useStoreState, useStoreActions } from "react-flow-renderer";
import { useAppSelector } from "../../app/hooks";
import { Typography } from "@mui/material";

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { ScreenPreviewData } from "../../interfaces/GraphNode";

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

const PreviewPanel = () => {

    const selectedNodeId = useAppSelector((state) => state.ui.previewing)
    const nodes = useStoreState((store) => store.nodes);
    const transform = useStoreState((store) => store.transform);
    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

    const formNode = useMemo(() => {
        const foundNodes = nodes.filter(node => node.id == selectedNodeId)

        if(foundNodes.length == 0) {
            return null
        }

        return foundNodes[0]
    }, [selectedNodeId, nodes])

    console.log('nodes on board', nodes, selectedNodeId)
    console.log('formNode', formNode)

    const [formData, setFormData] = useState({})

    const schemas = useMemo(() => {
        const schemaData = ScreenPreviewData[formNode?.data.formType]
        if(!schemaData || !schemaData.dataSchema || !schemaData.uiSchema) {
            return
        }

        return schemaData
    }, [formNode])

    return (
        <>
            <Typography variant="h5" gutterBottom component="div">
               Email and Password Form
            </Typography>
            { formNode && schemas && <Form
                schema={schemas.dataSchema}
                uiSchema={schemas.uiSchema}
                onChange={(newFormData) =>  setFormData(newFormData.formData)}
                formData={formData}
                submitButtonMessage="Login"
                />
            }
        </>
    )
}

export default PreviewPanel;