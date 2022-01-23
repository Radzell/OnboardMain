import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import * as cors from 'cors'
import { Connection, Edge, Elements, Node } from "./types";

admin.initializeApp()

const corsHandler = cors({ origin: true });




interface Form {
    dataSchema: any,
    uiScheme: any,
    name: string
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
                'email'
            ]
        },
        uiScheme: {
            password: {
                'ui:widget': 'password'
              },
              'ui:order': [
                'email',
                'password'
              ]
        },
        name: "Create a account"
    }
}

interface Flow {
    name?: string
    color?: string
    tagLine?: string
    elements: Elements<any>
    setCount?: number
    forms?: Record<string, Form>
}

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.getFlow = functions.https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
        const flowId = req.query.flowId as string

        console.log('flowId', flowId)
        if (!flowId) {
            res.status(400).send("invalid flowId")
            return
        }

        const flowSnap = await admin.firestore().collection(`/flows`).doc(flowId).get()

        if (!flowSnap.exists) {
            res.status(400).send("invalid flowId")
            return
        }

        const flow = flowSnap.data() as Flow
        const nodes = flow.elements.filter(element => exports.isNode(element)).map(element => element as Node);
        
        const forms: Record<string, Form> = nodes.filter(element => !!formsTemplates[element.data.formType])
            .reduce((prev, cur) => {
                prev[cur.data.formType] = formsTemplates[cur.data.formType]
                return prev
            },{} as Record<string, Form>)

        functions.logger.info("Hello flow", flow);

        flow.forms = forms


        res.send(flow);
    })
});

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
  'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: Node | Connection | Edge): element is Node =>
  'id' in element && !('source' in element) && !('target' in element);



    const findMaxPath = (count: number, node: Node, outputNodes: Record<string, Edge[]>, nodes: Record<string, Node>): number => {
        if(!node) {
            functions.logger.log('getting out 1',node)

            return count
        }

        const outs = outputNodes[node.id]
        functions.logger.log('flow.elements',outs)

        if(!outs) {
            functions.logger.log('getting out 2',count)

            return count
        }
        return Math.max(...outs.map(edge => {
            const root = nodes[edge.target]
            return findMaxPath(count+1, root, outputNodes, nodes)
        }))
    }

    exports.onFlowStats = functions.firestore
    .document('flows/{flowId}')
    .onWrite(async (_change, context) => {
        
        const flowId = context.params.flowId

        functions.logger.log('onFlowStatsDos', flowId)
        const flowSnap = await admin.firestore().collection(`/flows`).doc(flowId).get()
        if(!flowSnap.exists) {
            return
        }

        const flow = flowSnap.data() as Flow
        functions.logger.log('flow.elements',flow.elements)

        const edges  = flow.elements.filter(element => isEdge(element))
        const nodes: Node[]  = flow.elements.filter(element => isNode(element)) as Node[]
        const nodeSet = nodes.reduce((prev, cur) => {
            prev[cur.id] = cur
            return prev
        }, {} as Record<string, Node>)

        const outputEdges = edges.reduce((prev, cur) => {
            const edge = cur as Edge
            if(!prev[edge.source]) {
                prev[edge.source] = []
            }
            prev[edge.source].push(edge)
            return prev
        }, {} as Record<string, Edge[]>)



        const rootArr = flow.elements.filter(element => (!!element.data && element.data.formType) === 'entry')


        if(!rootArr|| rootArr.length !== 1) {
            return
        }

        const root = rootArr[0] as Node


        functions.logger.log('root', root)

        const maxPath = findMaxPath(0, root, outputEdges, nodeSet)

        functions.logger.info('maxPath', maxPath)


        if(maxPath === flow.setCount){
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
