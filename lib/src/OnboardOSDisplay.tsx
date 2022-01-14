import React from "react";
import { Flow } from ".";
import { Heading } from '@chakra-ui/react'

const OnboardOsDisplay = ({ flow }: {flow?: Flow}) => {

    if(!flow) {
        return <></>
    }

    
    return ( 
        <div>
            <Heading>{flow.name}</Heading>
        </div>
    )

}

export default OnboardOsDisplay