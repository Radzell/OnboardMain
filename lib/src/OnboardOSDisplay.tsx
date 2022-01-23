import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Flow } from ".";
import { Box, Container, Heading } from '@chakra-ui/react'
import { Edge, FlowElement, isEdge, isNode, Node } from './types'
import OSStep from "./OSStep";
import { RefObject } from "./useOnboardOS";
interface OSProps {
    flow?: Flow, 
    flowId:string,
    onValidate: (data: Record<string, any>) => string | boolean
}
const OnboardOsDisplay = forwardRef<RefObject | undefined, OSProps>((props, ref) => {

    const {flow, flowId, onValidate} = props
    if(!flow) {
        return <></>
    }

    const [stepCount, setStepCount] = useState<number>(0)
    const [step, setStep] = useState<Node>()

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

    const onNext =  (data?: Record<string, any>) => {
        console.log('onNext', data, step?.id)
        if(step?.data.validate && data) {
            onValidate(data)
            return
        }
        goForward()
    }


    const goForward = () => {
        if(!step) {
            return
        }
        const outputEdge = outputEdges[step.id]

        //For now assuming one edge

        if(!outputEdge || outputEdge.length !== 1) {
            return
        }

        const edge = outputEdge[0]
        const node = nodeSet[edge.target]

        setStep(node)
        setStepCount(stepCount+1)
    }

    useImperativeHandle(ref, () => ({ goForward }));

    

    
    return ( 
        <Box as={Container}  w='100%' h="100%">
            <OSStep onNext ={onNext} flow={flow} stepCount={stepCount} maxSteps={!!flow.stepCount ? flow.stepCount : 1} step={step} color={flow?.color} />
        </Box>
    )

})

export default OnboardOsDisplay