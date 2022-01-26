import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Flow } from ".";
import { Box, Center, Container, Heading, Spinner, useToast } from '@chakra-ui/react'
import { Edge, EndFunc, FlowElement, isEdge, isNode, Node, ValidateFunc } from './types'
import OSStep from "./OSStep";
import { RefObject } from "./useOnboardOS";
interface OSProps {
    flow?: Flow, 
    flowId:string,
    onValidate: ValidateFunc,
    onEnd: EndFunc
}
const OnboardOsDisplay = forwardRef<RefObject | undefined, OSProps>((props, ref) => {
    let totalData = {}
    const {flow, flowId, onValidate, onEnd} = props
    if(!flow) {
        return <></>
    }

    const [stepCount, setStepCount] = useState<number>(0)
    const [step, setStep] = useState<Node>()
    const [currentData, setCurrentData] = useState<object>()
    const [isLoading, setIsLoading] = useState<string | null>()

    const edges = useMemo(() => {
        return flow?.elements.filter((element) => isEdge(element)).map(element => element as Edge)
    },[flow])

    const nodeSet = useMemo(() => {


        if(!flow) {
            return {}
        }
        const nodes = flow.elements.filter((element) => isNode(element)).map(element => element as Node)

        return nodes.reduce((prev, cur) => {
            prev[cur.id] = cur 
            return prev
        }, {} as Record<string, Node>)
    },[flow])

    useEffect(() => {
        if(!nodeSet) {
            return
        }


        const rootArr = flow.elements.filter(element => (!!element.data && element.data.formType) === 'entry')


        if(!rootArr|| rootArr.length !== 1) {
            return
        }

        const root = rootArr[0] as Node

        const firstStepArr = outputEdges[root.id]

        if(firstStepArr && firstStepArr.length === 1) {
            const edge = firstStepArr[0]

            const firstStep = nodeSet[edge.target]
            setStep(firstStep)
        }
        
    }, [flowId, nodeSet])


    

    const outputEdges = useMemo(() => {
        if(!edges) {
            return {}
        }
        return edges?.reduce((prev, cur) => {
            const edge = cur as Edge
            if(!prev[edge.source]) {
                prev[edge.source] = []
            }
            prev[edge.source].push(edge)
            return prev
        }, {} as Record<string, Edge[]>)
    },[edges])


    const toast = useToast()


    const validateAsync = async (data?: object) => {
        if(!step || !data) {
            return
        }
        const validationMessage = await onValidate(step.id, step.data.formType, data);
        console.log('validationMessage', validationMessage);
        if (typeof validationMessage === 'string') {
            toast({
                title: 'Error',
                description: validationMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }

        if(validationMessage === true) {
            goForward()
        }
    }

    const onNext =  (data?: object) => {
        console.log('onNext', data, step?.id)

        if(!step) {
            return
        }
        
        setCurrentData(data)
        
        const formSetting = flow.formSettings

        if(data && formSetting && formSetting[step.id] && formSetting[step.id].validate) {
            validateAsync(data);
            return
        }
        goForward()

        
    }


    const goForward = () => {
        console.log("goForward", step)
        if(!step) {
            return
        }

        totalData = {...totalData, ...currentData}

        const outputEdge = outputEdges[step.id]

        //For now assuming one edge

        if(!outputEdge || outputEdge.length !== 1) {
            onEnd(totalData, {})
            return
        }

        const edge = outputEdge[0]
        const node = nodeSet[edge.target]

        setStep(node)
        setStepCount(stepCount+1)
    }

    const startLoader = (message: string) => {
        setIsLoading(message)
    }

    const stopLoader = () => {
        setIsLoading(null)

    }

    useImperativeHandle(ref, () => ({ goForward, startLoader, stopLoader }));

    

    
    return ( 
        <Box as={Container}  w='100%' h="100%">
            {!!isLoading && 
                <Center>
                    <Box display='flex' flexDirection="column" alignItems="center">
                        <Spinner size='xl' />
                        <Heading>{isLoading}</Heading>
                    </Box>
                </Center>
            }
            {!isLoading && <OSStep onNext ={onNext} flow={flow} stepCount={stepCount} maxSteps={!!flow.stepCount ? flow.stepCount : 1} step={step} color={flow?.color} />}
        </Box>
    )

})

export default OnboardOsDisplay