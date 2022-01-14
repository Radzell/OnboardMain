import React from "react";
import { Flow } from ".";

const OnboardOsDisplay = ({ flow }: {flow?: Flow}) => {

    if(!flow) {
        return <></>
    }

    
    return ( 
        <div>
            <p>{flow.name}</p>
        </div>
    )

}

export default OnboardOsDisplay