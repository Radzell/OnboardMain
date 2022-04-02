import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Flow } from ".";
import { Box, Center, Container, Heading, Spinner, useToast, Text } from '@chakra-ui/react'
import { Edge, EndFunc, isEdge, isNode, Node, onActionFunc, ValidateFunc } from './types'
import OSStep from "./OSStep";
import { RefObject } from "./useOnboardOS";
interface OSProps {
    flow?: Flow,
    apiKey: string,
    onValidate?: ValidateFunc,
    onEnd: EndFunc,
    onAction?: onActionFunc
}
const OnboardOsDisplay = forwardRef<RefObject | undefined, OSProps>((props, ref) => {
    let totalData = {}
    const { flow, apiKey, onValidate, onEnd, onAction } = props
    if (!flow) {
        return <></>
    }

    const [stepCount, setStepCount] = useState<number>(0)
    const [step, setStep] = useState<Node>()
    const [showEmptyScreen, setShowEmptyScreen] = useState<boolean>()

    const _currentData = useRef<object>({})
    const _totalData = useRef<object>({})

    const [isLoading, setIsLoading] = useState<string | null>()

    const edges = useMemo(() => {
        return flow?.elements.filter((element) => isEdge(element)).map(element => element as Edge)
    }, [flow])

    const nodeSet = useMemo(() => {


        if (!flow) {
            return {}
        }
        const nodes = flow.elements.filter((element) => isNode(element)).map(element => element as Node)

        return nodes.reduce((prev, cur) => {
            prev[cur.id] = cur
            return prev
        }, {} as Record<string, Node>)
    }, [flow])

    useEffect(() => {
        if (!nodeSet) {
            return
        }


        const rootArr = flow.elements.filter(element => (!!element.data && element.data.formType) === 'entry')


        if (!rootArr || rootArr.length !== 1) {
            return
        }

        const root = rootArr[0] as Node

        const firstStepArr = outputEdges[root.id]

        if (firstStepArr && firstStepArr.length === 1) {
            const edge = firstStepArr[0]

            const firstStep = nodeSet[edge.target]
            setStep(firstStep)
        }


        //if array after entry is null then show empty screen
        if(!firstStepArr) {
            setShowEmptyScreen(true)
        }
    }, [apiKey, nodeSet])




    const outputEdges = useMemo(() => {
        if (!edges) {
            return {}
        }
        return edges?.reduce((prev, cur) => {
            const edge = cur as Edge
            if (!prev[edge.source]) {
                prev[edge.source] = []
            }
            prev[edge.source].push(edge)
            return prev
        }, {} as Record<string, Edge[]>)
    }, [edges])


    const toast = useToast()


    const validateAsync = async (data?: object) => {
        if (!step || !data || !onValidate) {
            return
        }
        const validationMessage = await onValidate(step.id, step.data.formType, data);
        if (typeof validationMessage === 'string') {
            toast({
                title: 'Error',
                description: validationMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }

        if (validationMessage === true) {
            goForward()
        }
    }

    const onNext = (data?: Record<string, any>) => {

        if (!step) {
            return
        }

        if (data) {
            _currentData.current = data
        }

        const formSetting = flow.formSettings

        if (data && formSetting && formSetting[step.id] && formSetting[step.id].validate) {
            validateAsync(data);
            return
        }
        goForward(data?.option)


    }


    const goForward = (optionPath?: string) => {

        if (!step) {
            return
        }


        _totalData.current = {
            ..._totalData.current,
            [step.id]: {
                data: _currentData.current,
                type: step.data.formType
            }
        }


        const outputEdge = outputEdges[step.id]

        //For now assuming one edge
        moveToNextStep(outputEdge, optionPath)
    }

    const moveToNextStep = (outputEdges: Edge[], option?: string) => {
        //For now assuming one edge

        if (!outputEdges || outputEdges.length === 0) {
            onEnd(_totalData.current, {})
            return
        }

        let edge = null
        if(!option) {
            edge = outputEdges[0]
        }

        if(option === "option_b") {
            const foundEdge = outputEdges.find((value) => value.sourceHandle === "optionB")
            edge = foundEdge
        }

        if(option === "option_a") {
            const foundEdge = outputEdges.find((value) => value.sourceHandle === "optionA")
            edge = foundEdge
        }

        if(!edge) {
            console.error("couldn't find a next step")
            onEnd(_totalData.current, {})
            return
        }

        const node = nodeSet[edge.target]

        setStep(node)
        setStepCount(stepCount + 1)


    }

    const startLoader = (message: string) => {
        setIsLoading(message)
    }

    const stopLoader = () => {
        setIsLoading(null)

    }

    useImperativeHandle(ref, () => ({ goForward, startLoader, stopLoader }));




    return (
        <Box as={Container} w='100%' h="100%">
            {!!isLoading &&
                <Center>
                    <Box display='flex' flexDirection="column" alignItems="center">
                        <Spinner size='xl' />
                        <Heading>{isLoading}</Heading>
                    </Box>
                </Center>
            }
            {(!isLoading && !showEmptyScreen) && <OSStep onNext={onNext} onAction={onAction} flow={flow} stepCount={stepCount}
maxSteps={!!flow.stepCount ? flow.stepCount : 1}
                step={step} color={flow?.color ?? "#000"} />
            }

            {showEmptyScreen && 
                <Center h='100%'>
                    <Text>Onboarding Flow Empty</Text>
                </Center>
            }
        </Box>
    )

})

export default OnboardOsDisplay