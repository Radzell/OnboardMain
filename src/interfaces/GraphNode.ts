import CSS from 'csstype';

export interface GraphNode {
    id: string,
    position: {
        x: number,
        y: number,
    },
    data: any,
    type?: string,
    style?: CSS.Properties,
    className?: string,
    targetPosition?: string,
    sourcePosition?: string,
    isHidden?: boolean,
    draggable?: boolean,
    connectable? :boolean,
    selectable?: boolean,
    dragHandle?: string
}

export declare enum ScreenType {
    ENTRY = "entry",
    WELCOME = "welcome",
    EMAIL_AND_PASSWORD = "email_and_password"
}

export const ScreenMetaData = {
    "entry": {
        name: "Entry",
        type: "input",
        schemaChangable: false
    },
    "welcome": {
        name: "Welcome",
        type: "default",
        schemaChangable: false
    },
    "email_and_password": {
        name: "Email and Password",
        type: "default",
        schemaChangable: false
    },
}