import React, { useEffect, useState } from "react";
import axios from 'axios';
import localforage from 'localforage'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'

interface Flow {
    name?: string
    color?: string
    tagLine?: string
    elements: any[]

}

function isObject(object:any) {
    return object != null && typeof object === 'object';
  }

function deepEqual(object1:any, object2:any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
  }

export const OnboardOS = ({ flowId }: { flowId: string }): JSX.Element => {
    const [flow, setFlow] = useState <Flow | null>(null)

        useEffect(() => {
            const getFlow = async () => {
                const result = await axios.get(`https://us-central1-onboard-os.cloudfunctions.net/getFlow?flowId=${flowId}`)

                const flow = result.data as Flow
                console.log('flow', flow)

                await localforage.setItem(flowId, flow)
                setFlow(flow)
            }

            getFlow()
        }, [flowId])

        useEffect(() => {
            const getFlow = async () => {
                const _flow = await localforage.getItem(flowId) as Flow | null

                if(_flow && deepEqual(_flow, flow)) {
                    setFlow(_flow)
                }
            }

            getFlow()
        }, [])

    return (
        <ThemeProvider theme={theme}>
            {!flow && <div>Loading</div>}

        </ThemeProvider>
    )
}
