import React, { useEffect, useState } from "react";
import axios from 'axios';
import localforage from 'localforage'
import { Elements } from "./types";
import OnboardOsDisplay from "./OnboardOSDisplay";
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
import { RefObject, RegisterReturn } from "./useOnboardOS";

export interface Form {
    dataSchema: any,
    uiScheme: any,
    name: string
}

export interface Flow {
    name?: string
    color?: string
    tagLine?: string
    elements: Elements,
    stepCount?: number,
    forms?: Record<string, Form>
}

function isObject(object:any) {
    return object != null && typeof object === 'object';
  }

function deepEqual(object1?:any, object2?:any) {

    if(!object1 || !object2) {
        return false
    }
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



export const OnboardOS = ({ flowId, register, onValidate }: { flowId: string, register: () => RegisterReturn, onValidate: () => boolean | string }): JSX.Element => {
    const [flow, setFlow] = useState <Flow>()
    const [osRef, setOSRef] = useState<React.MutableRefObject<RefObject | undefined>>()


    useEffect(() => {
      if(!register) {
        return
      }

      setOSRef(register().ref)
    },[])

    const theme = extendTheme({
        components: {
          Steps,
        },
        colors: {
            brand: {
              500: !!flow?.color ? flow?.color : "green",
            },
        },
    })

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
                    setFlow(flow)
                }
            }

            getFlow()
        }, [])

    console.log('flowing', flow)

    return (
        <ChakraProvider theme={theme} >
                <CSSReset />
                {!flow && <div>Loading</div>}
                <OnboardOsDisplay onValidate={onValidate} ref={osRef} flowId={flowId} flow={flow} />
        </ChakraProvider>
    )
}
