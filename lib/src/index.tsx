import React, { useEffect, useState } from "react";
import axios from 'axios';
import localforage from 'localforage'
import { Elements, EndFunc, onActionFunc, ValidateFunc } from "./types";
import OnboardOsDisplay from "./OnboardOSDisplay";
import { Center, ChakraProvider, CSSReset, extendTheme, HStack, Text, VStack } from '@chakra-ui/react'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
import { RefObject, RegisterReturn } from "./useOnboardOS";

export interface Form {
  dataSchema: any,
  uiScheme: any,
  name: string
}

export interface FormSetting {
  validate: boolean
}


export interface Flow {
  name?: string
  color?: string
  tagLine?: string
  elements: Elements,
  stepCount?: number,
  forms?: Record<string, Form>
  formSettings?: Record<string, FormSetting>,
  logoDownloadUrl?: string
}

export { useOnboardOS } from './useOnboardOS';


function isObject(object: any) {
  return object != null && typeof object === 'object';
}

function deepEqual(object1?: any, object2?: any) {

  if (!object1 || !object2) {
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



export const OnboardOS = ({ apiKey, register, onValidate, onEnd, onAction, testing }: { apiKey: string, register: () => RegisterReturn, onValidate: ValidateFunc, onEnd: EndFunc, onAction: onActionFunc, testing?: boolean }): JSX.Element => {
  const [flow, setFlow] = useState<Flow>()
  const [osRef, setOSRef] = useState<React.MutableRefObject<RefObject | undefined>>()
  const [hasGetFlowError, setGetFlowError] = useState<boolean>(false)


  useEffect(() => {
    if (!register) {
      return
    }

    setOSRef(register().ref)
  }, [])

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
      try {
        
        const result = await axios.get(`https://us-central1-onboard-os.cloudfunctions.net/getFlow?apiKey=${apiKey}&istest=${testing}`)

        const flow = result.data as Flow

        await localforage.setItem(apiKey, flow)
        setFlow(flow)
      } catch (e) {
        setGetFlowError(true)
      }

    }

    getFlow()
  }, [apiKey, testing])

  useEffect(() => {
    const getFlow = async () => {
      const _flow = await localforage.getItem(apiKey) as Flow | null

      if (_flow && deepEqual(_flow, flow)) {
        setFlow(flow)
      }
    }
    getFlow()
  }, [apiKey])


  return (
    <ChakraProvider theme={theme} >
      <CSSReset />
      {(!flow && !hasGetFlowError) && <Center h='100%'><Text>Loading From OnboardOS...</Text></Center>}
      <OnboardOsDisplay onAction={onAction} onEnd={onEnd} onValidate={onValidate} ref={osRef} apiKey={apiKey} flow={flow} />
      {hasGetFlowError &&
        <Center h='100%'>
          <VStack>
            <Text>sign up form not found</Text>
          </VStack>
        </Center>
      }
    </ChakraProvider>
  )
}
