import { Node, onActionFunc } from './types'
import React, { useEffect } from 'react'
import { useSteps } from 'chakra-ui-steps';
import WelcomeScreen from './OnboardScreens/WelcomeScreen';
import { Flow, Form } from '.';
import { Box, Flex, Text, Image, Progress } from '@chakra-ui/react';
import { Step } from './steps/Step'
import { Steps } from './steps/Steps'

import FormScreen from './OnboardScreens/FormScreen';
import EndPointScreen from './OnboardScreens/EndPointScreen';
import CreateOrJoinOrg from './OnboardScreens/CreateOrJoinOrg';
import { getCheckIcon } from './steps/Icons/Check';
import ThisOrThat from './OnboardScreens/ThisOrThat';
import ButtonScreen from './OnboardScreens/ButtonScreen';
import chroma from 'chroma-js'
import { useMemo } from 'react';

const OSStep = ({ flow, step, maxSteps, stepCount, color, onNext, onAction }: { flow: Flow, step?: Node, maxSteps: number, stepCount: number, color: string, onNext: (data?: Record<string, any>) => void, onAction?: onActionFunc }) => {
    const { setStep, activeStep } = useSteps({
        initialStep: 0,
    })

    useEffect(() => {
        setStep(stepCount)
    }, [stepCount])





    const getForm = () => {

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

                const forms = flow.forms ?? {}

                return <ThisOrThat stepId={step.id} form={forms[step.data.formType]} flow={flow} onNext={onNext} />
            }
            case 'button_screen': {
                const forms = flow.forms ?? {}

                return <ButtonScreen stepId={step.id} stepType={step.data.formType} form={forms[step.data.formType]} flow={flow}
                    onAction={onAction} onNext={onNext} />
            }
            case 'custom_form_screen': {
                const formSetting = flow.formSettings[step.id]

                const form: Form = {
                    dataSchema: JSON.parse(formSetting.schema),
                    uiScheme: JSON.parse(formSetting.schema),
                    name: formSetting.title ?? "Untitled"
                }
                return <FormScreen stepId={step.id} form={form} flow={flow} onNext={onNext} />
            }
        }

        if (!!flow?.forms) {
            const form = flow?.forms[step.data.formType]

            if (form) {
                return <FormScreen stepId={step.id} form={form} flow={flow} onNext={onNext} />
            }
        }
    }

    const flowColor = useMemo(() => {
        console.log("flow.color", flow?.color)
        return flow?.color ? chroma(flow?.color).css() : "rgba(43,108,176,1)"
    }, [flow?.color])

    const brightColor = useMemo(() => {
        return chroma(flowColor).brighten().css()

    }, [flowColor])

    if (!step) {
        return <></>
    }

    
    return <Box h="100%" pt={8}>
        <Flex pb={4} justifyContent={"center"} alignItems={"center"}>
            <Flex flexDirection={"row"} alignItems={"center"} >
                {flow.logoDownloadUrl && <Image
                    style={{ marginRight: 8 }}
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
        <Progress borderRadius="2xl"
            sx={{
                '& > div': {
                    background: `linear-gradient(90deg, ${flowColor} 10%, ${brightColor} 90%)`,
                },
            }} value={(activeStep / maxSteps) * 100} />

        {getForm()}
    </Box>
}

export default OSStep