import { Node, onActionFunc } from './types'
import React, { useEffect } from 'react'
import { Node } from './types'
import { useSteps, Steps } from 'chakra-ui-steps';
import WelcomeScreen from './OnboardScreens/WelcomeScreen';
import { Flow } from '.';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { Step } from './steps/Step'
import FormScreen from './OnboardScreens/FormScreen';
import EndPointScreen from './OnboardScreens/EndPointScreen';
import CreateOrJoinOrg from './OnboardScreens/CreateOrJoinOrg';
import { getCheckIcon } from './steps/Icons/Check';
import ThisOrThat from './OnboardScreens/ThisOrThat';
import ButtonScreen from './OnboardScreens/ButtonScreen';

const OSStep = ({ flow, step, maxSteps, stepCount, color, onNext, onAction }: { flow: Flow, step?: Node, maxSteps: number, stepCount: number, color: string, onNext: (data?: Record<string, any>) => void,  onAction?: onActionFunc }) => {
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
        switch (step.data.formType) {
            case "welcome": {
                return <WelcomeScreen flow={flow} onNext={onNext} />
            }
            case 'end_point': {
                return <EndPointScreen flow={flow} onNext={onNext} />
            }
            case 'create_or_join_org': {
                return <CreateOrJoinOrg stepId={step.id} flow={flow} onNext={onNext} />
            }
            case 'this_or_that': {
                return <ThisOrThat stepId={step.id} form={flow?.forms[step.data.formType]} flow={flow} onNext={onNext} />
            }
            case 'button_screen': {
                return <ButtonScreen stepId={step.id} stepType={step.data.formType} form={flow?.forms[step.data.formType]} flow={flow} onAction={onAction} onNext={onNext} />
            }
        }


        console.log('flow info', flow?.forms)
        if (!!flow?.forms && flow?.forms[step.data.formType]) {
            console.log('flow info 2', flow?.forms[step.data.formType])
            return <FormScreen stepId={step.id} form={flow?.forms[step.data.formType]} flow={flow} onNext={onNext} />
        }
    }

    console.log("maxSteps", step)
    return <Box h="100%" pt={8}>
        <Flex  pb={4} justifyContent={"center"} alignItems={"center"}>
            <Flex flexDirection={"row"} alignItems={"center"} >
                {flow.logoDownloadUrl && <Image
                    style={{marginRight: 8}}
                    boxSize='50px'
                    objectFit='contain'
                    src={flow.logoDownloadUrl}
                    alt='Dan Abramov'
                />}
                <Text fontWeight={600} fontSize='md' as={'span'} color={flow.color}>
                    {flow.name}
                </Text>
            </Flex>
        </Flex>

        <Steps colorScheme={color} activeStep={activeStep}>

            {Array(maxSteps).fill(1).map((_, index) => (
                //@ts-ignore
                <Step //@ts-ignore 
                checkIcon={getCheckIcon(flow?.color ?? "#fff")} label={`Step ${index + 1}`} key={index}>

                </Step>
            ))}
        </Steps>
        {getForm()}
    </Box>
}

export default OSStep