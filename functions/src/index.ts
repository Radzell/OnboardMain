import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import * as cors from 'cors'
import { Connection, Edge, Elements, Node } from "./types";

admin.initializeApp()

const corsHandler = cors({ origin: true });




interface Form {
    dataSchema: any,
    name: string
}


interface FormSetting {
    title: string,
    description: string,
    optionA: string,
    optionB: string,
    validate: boolean
}

const formsTemplates: Record<string, Form> = {
    email_and_password: {
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
                'email',
                'password'
            ]
        },

        name: "Create a account"
    },
    email_and_password_and_name: {
        dataSchema: {
            type: 'object',
            title: '',
            properties: {
                user_name: {
                    title: 'User name',
                    type: 'string'
                },
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
                'user_name',
                'email',
                'password'
            ]
        },

        name: "Create a account"
    },
    profile: {
        name: "Profile",
        dataSchema: {
            title: "",
            type: "object",
            required: [
                "firstName",
                "lastName"
            ],
            properties: {
                firstName: {
                    "type": "string",
                    "title": "First name",
                    "default": "Chuck"
                },
                lastName: {
                    "type": "string",
                    "title": "Last name"
                },
                telephone: {
                    "type": "string",
                    "title": "Phone",
                    "minLength": 10
                }
            }
        }

    }
}

interface Flow {
    name?: string
    color?: string
    tagLine?: string
    elements: Elements<any>
    setCount?: number
    forms?: Record<string, Form>
    formSettings?: Record<string, FormSetting>
    logoName?: string
    logoDownloadUrl?: string,
    apiKey?: string,
    testApiKey?: string
}

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.restoreFlow = functions.https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
        const flowId = req.query.flowId as string
        const flowSnap = await admin.firestore().collection(`/prod-flows`).doc(flowId).get()

        if (!flowSnap.exists) {
            res.status(400).send("invalid flowId")
            return
        }

        admin.firestore().collection(`/flows`).doc(flowId).update(flowSnap.data() as object)
    })
})

exports.createProdFlowApiKey = functions.firestore
    .document('prod-flows/{flowId}')
    .onCreate(async (_snapshot, context) => {
        const flowId = context.params.flowId
        const ref = admin.firestore().collection("prod-flows").doc()
        const apiKey = ref.id
        await  admin.firestore().collection("/prod-flows").doc(flowId).update({
            apiKey
        })
})

exports.createFlowApiKey = functions.firestore
    .document('flows/{flowId}')
    .onCreate(async (_snapshot, context) => {
        const flowId = context.params.flowId
        const ref = admin.firestore().collection("flows").doc()
        const apiKey = ref.id
        await  admin.firestore().collection("/flows").doc(flowId).update({
            testApiKey: apiKey
        })
})

exports.updateProdFlowApiKey = functions.firestore
    .document('prod-flows/{flowId}')
    .onUpdate(async (_snapshot, context) => {
        const flowId = context.params.flowId

        //check if has apikey already
        const flowSnap = await  admin.firestore().collection("/prod-flows").doc(flowId).get()

        if(!flowSnap.exists) {
            return
        }

        const flow = flowSnap.data() as Flow

        if(!!flow.apiKey) {
            return
        }

        const ref = admin.firestore().collection("prod-flows").doc()
        const apiKey = ref.id
        await  admin.firestore().collection("/prod-flows").doc(flowId).update({
            apiKey
        })
})

exports.updateFlowApiKey = functions.firestore
    .document('flows/{flowId}')
    .onUpdate(async (_snapshot, context) => {
        const flowId = context.params.flowId

        //check if has apikey already
        const flowSnap = await  admin.firestore().collection("/flows").doc(flowId).get()

        if(!flowSnap.exists) {
            return
        }

        const flow = flowSnap.data() as Flow

        if(!!flow.testApiKey) {
            return
        }

        const ref = admin.firestore().collection("flows").doc()
        const apiKey = ref.id
        await  admin.firestore().collection("/flows").doc(flowId).update({
            testApiKey: apiKey
        })
})

exports.getFlow = functions.https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
        const apiKey = req.query.apiKey as string

        console.log('flowId', apiKey)
        if (!apiKey) {
            res.status(400).send("invalid apiKey")
            return
        }

        const flowSnap = await admin.firestore().collection(`/prod-flows`).where('apiKey', '==', apiKey).limit(1).get()

        if (flowSnap.size != 1 || !flowSnap.docs[0].exists) {
            res.status(400).send("invalid flowId")
            return
        }

        const flow = flowSnap.docs[0].data() as Flow

        console.log("flow.logoName", flow.logoName)
        if(flow.logoName){
            const [logoUrl] = await admin.storage().bucket().file(`images/${flow.logoName}`).getSignedUrl({
                version: 'v2',                            // default value
                action: 'read',                           // read | write | delete | resumable
                expires: Date.now() + 500 * 60 * 60      // expire date, one minute from now
            })

            functions.logger.info("logoUrl", logoUrl)
            flow.logoDownloadUrl = logoUrl
        }
        const nodes = flow.elements.filter(element => exports.isNode(element)).map(element => element as Node);
        const nodeIds = nodes.map(node => node.id)

        const flowFormsRef = admin.firestore().collection('flowForms')

        const formSettingSnap = await flowFormsRef.where(admin.firestore.FieldPath.documentId(), "in", nodeIds).get()

        functions.logger.info("flowForms", nodeIds, formSettingSnap.size)

        const formSettings = formSettingSnap.docs.reduce((prev, cur) => {
            prev[cur.id] = cur.data() as FormSetting
            return prev
        }, {} as Record<string, FormSetting>)
        const forms: Record<string, Form> = nodes.filter(element => !!formsTemplates[element.data.formType])
            .reduce((prev, cur) => {
                prev[cur.data.formType] = formsTemplates[cur.data.formType]
                return prev
            }, {} as Record<string, Form>)

        functions.logger.info("Hello flow", flow);

        flow.forms = forms
        flow.formSettings = formSettings


        res.send(flow);
    })
});

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
    'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: Node | Connection | Edge): element is Node =>
    'id' in element && !('source' in element) && !('target' in element);



const findMaxPath = (count: number, node: Node, outputNodes: Record<string, Edge[]>, nodes: Record<string, Node>): number => {
    if (!node) {
        functions.logger.log('getting out 1', node)

        return count
    }

    const outs = outputNodes[node.id]
    functions.logger.log('flow.elements', outs)

    if (!outs) {
        functions.logger.log('getting out 2', count)

        return count
    }
    return Math.max(...outs.map(edge => {
        const root = nodes[edge.target]
        return findMaxPath(count + 1, root, outputNodes, nodes)
    }))
}

exports.onFlowDeploy_FormSetting = functions.firestore
    .document('prod-flows/{flowId}')
    .onWrite(async (_change, context) => {
        const flowId = context.params.flowId

        functions.logger.log('onFlowDeploy', flowId)
        const flowSnap = await admin.firestore().collection(`/prod-flows`).doc(flowId).get()
        if (!flowSnap.exists) {
            return
        }

        const flow = flowSnap.data() as Flow
        const nodes = flow.elements.filter(element => exports.isNode(element)).map(element => element as Node);
        const nodeIds = nodes.map(node => node.id)

        const flowFormsRef = admin.firestore().collection('flowForms')

        const formSettingSnap = await flowFormsRef.where(admin.firestore.FieldPath.documentId(), "in", nodeIds).get()


        const formSettings = formSettingSnap.docs

        const batch = admin.firestore().batch();

        for(const formSetting of formSettings) {
            const flowFormRef = admin.firestore().collection("prod-flowForms").doc(formSetting.id);
            batch.set(flowFormRef, formSetting.data())
        }

        batch.commit()
    })

exports.onFlowStats = functions.firestore
    .document('flows/{flowId}')
    .onWrite(async (_change, context) => {

        const flowId = context.params.flowId

        functions.logger.log('onFlowStatsDos', flowId)
        const flowSnap = await admin.firestore().collection(`/flows`).doc(flowId).get()
        if (!flowSnap.exists) {
            return
        }

        const flow = flowSnap.data() as Flow
        functions.logger.log('flow.elements', flow.elements)

        const edges = flow.elements.filter(element => isEdge(element))
        const nodes: Node[] = flow.elements.filter(element => isNode(element)) as Node[]
        const nodeSet = nodes.reduce((prev, cur) => {
            prev[cur.id] = cur
            return prev
        }, {} as Record<string, Node>)

        const outputEdges = edges.reduce((prev, cur) => {
            const edge = cur as Edge
            if (!prev[edge.source]) {
                prev[edge.source] = []
            }
            prev[edge.source].push(edge)
            return prev
        }, {} as Record<string, Edge[]>)



        const rootArr = flow.elements.filter(element => (!!element.data && element.data.formType) === 'entry')


        if (!rootArr || rootArr.length !== 1) {
            return
        }

        const root = rootArr[0] as Node


        functions.logger.log('root', root)

        const maxPath = findMaxPath(0, root, outputEdges, nodeSet)

        functions.logger.info('maxPath', maxPath)


        if (maxPath === flow.setCount) {
            return
        }

        admin.firestore().collection(`/flows`).doc(flowId).update({
            stepCount: maxPath
        })
        return
        // If we set `/users/marie` to {name: "Marie"} then
        // context.params.userId == "marie"
        // ... and ...
        // change.after.data() == {name: "Marie"}
    })
