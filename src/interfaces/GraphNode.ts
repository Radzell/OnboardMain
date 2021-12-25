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
    connectable?: boolean,
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
        type: "formNode",
        schemaChangable: false
    },
    "email_and_password": {
        name: "Email and Password",
        type: "formNode",
        schemaChangable: false
    },
}

export const ScreenPreviewData = {
    "entry": {
        name: "Entry",
    },
    "welcome": {
        name: "Welcome",
    },
    "email_and_password": {
        name: "Email and Password",
        dataSchema: {
            type: 'object',
            title: '',
            properties: {
                email: {
                    title: 'Email',
                    type: 'string'
                },
                password: {
                    title: 'Password',
                    type: 'string'
                }
            },
            dependencies: {},
            required: [
                'email'
            ]
        },
        uiSchema: {
            password: {
                'ui:widget': 'password'
              },
              'ui:order': [
                'email',
                'password'
              ]
        }
    },
}