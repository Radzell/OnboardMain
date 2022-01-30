import React, { useCallback, useEffect } from 'react'
import { Node } from './types'
import { useSteps, Steps } from 'chakra-ui-steps';
import WelcomeScreen from './OnboardScreens/WelcomeScreen';
import { Flow } from '.';
import { Box } from '@chakra-ui/react';
import {Step} from './steps/Step'
import FormScreen from './OnboardScreens/FormScreen';
import FolderSelectScreen from './OnboardScreens/FolderSelectScreen';
import EndPointScreen from './OnboardScreens/EndPointScreen';
import CreateOrJoinOrg from './OnboardScreens/CreateOrJoinOrg';
import { getCheckIcon } from './steps/Icons/Check';


const OSStep = ({ flow, step, maxSteps, stepCount, color, onNext }: { flow: Flow, step?: Node, maxSteps: number, stepCount: number, color: string, onNext: (data?: Record<string, any>) => void }) => {
    const { setStep, activeStep } = useSteps({
        initialStep: 0,
    })

    useEffect(() => {
        console.log('step', step)
        setStep(stepCount)
    }, [stepCount])
    
    if (!step) {
        return <></>
    }


    
    
    const getForm = () => {

        console.log('step.data.formType', step.data.formType)
        switch(step.data.formType) {
            case "welcome": {
                return <WelcomeScreen flow={flow} onNext={onNext} />
            }
            case "folder_picker": {
                return <FolderSelectScreen flow={flow} onNext={onNext} />
            }
            case 'end_point': {
                return <EndPointScreen flow={flow} onNext={onNext} />
            }
            case 'create_or_join_org': {
                return <CreateOrJoinOrg stepId={step.id} flow={flow} onNext={onNext} />
            }
        }


        console.log('flow info',flow?.forms)
        if(!!flow?.forms && flow?.forms[step.data.formType]) {
            console.log('flow info 2', flow?.forms[step.data.formType])
            return <FormScreen stepId={step.id} form={flow?.forms[step.data.formType]} flow={flow} onNext={onNext} />
        }
    }

    console.log("maxSteps", step)
    return <Box maxw="100%" h="100%" pt={8}>
        <Steps colorScheme={color} activeStep={activeStep}>

            {Array(maxSteps).fill(1).map((_, index) => (
                <Step checkIcon={getCheckIcon(flow?.color ?? "#fff")} label={`Step ${index+1}`} key={index}>
                   
                </Step>
            ))}
        </Steps>
        {getForm()}
    </Box>
}

export default OSStep