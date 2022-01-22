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

export enum ScreenType {
    ENTRY = "entry",
    WELCOME = "welcome",
    EMAIL_AND_PASSWORD = "email_and_password",
    EMAIL_PASSWORD_AND_NAME = "email_and_password_and_name",
    FOLDER_PICKER = "folder_picker",
    ADDON_SIGNUP = "addon_signup",
    VIDEO_TUTORIAL = "video_tutorials",
    END_POINT = "end_point"
}

export type ScreenMetaDataType = {
    name: string,
    type: string;
    schemaChangable: boolean
}

export const ScreenMetaDataMap: Record<string, ScreenMetaDataType> = {
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
    "email_and_password_and_name": {
        name: "Email, Password and Name",
        type: "formNode",
        schemaChangable: false
    },
    "folder_picker": {
        name: "Pick a folder",
        type: "formNode",
        schemaChangable: false
    },
    "addon_signup": {
        name: "Select an Addon",
        type: "formNode",
        schemaChangable: false
    },
    "video_tutorials": {
        name: "Video Tutorial",
        type: "formNode",
        schemaChangable: false
    },
    "end_point": {
        name: "EndPoint",
        type: "formNode",
        schemaChangable: false
    }

}


export type ScreenPreviewData = {
    name: string,
    dataSchema?: any
    uiSchema?: any
}

export const ScreenPreviewDataMap: Record<string, ScreenPreviewData> = {
    "entry": {
        name: "Entry",
    },
    "welcome": {
        name: "Welcome",
    },
    "email_and_password": {
        name: "Create a account",
        dataSchema: {
            type: 'object',
            title: 'Create an account',
            properties: {
                email: {
                    title: 'Email',
                    type: 'string',
                    format: "email"
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
    "folder_picker": {
        name: "Pick a folder",
    },
    "addon_signup": {
        name: "Select an Addon",
    },
    "video_tutorials": {
        name: "Video Tutorial",
    },
    "end_point": {
        name: "endpoint"
    }
}