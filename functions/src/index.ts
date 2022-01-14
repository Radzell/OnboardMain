import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import * as cors from 'cors'
import { Connection, Edge, Elements, Node } from "./types";

admin.initializeApp()

const corsHandler = cors({ origin: true });

interface Flow {
    name?: string
    color?: string
    tagLine?: string
    elements: Elements<any>

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

        functions.logger.info("Hello flow", flow);


        res.send(flow);
    })
});

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
  'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: Node | Connection | Edge): element is Node =>
  'id' in element && !('source' in element) && !('target' in element);

  
exports.onFlowStats = functions.firestore
    .document('flows/{flowId}/elements')
    .onUpdate(async (_change, context) => {
        const flowId = context.params.flowId
        const flowSnap = await admin.firestore().collection(`/flows`).doc(flowId).get()
        if(!flowSnap.exists) {
            return
        }

        const flow = flowSnap.data() as Flow
        const edges  = flow.elements.filter(element => isEdge(element))

        //@ts-ignore
        const inputEdges = edges.reduce((prev, cur) => {
            const edge = cur as Edge
            prev[edge.source] = edge
            return prev
        }, {} as Record<string, Edge>)

        //@ts-ignore
        const outEdges = edges.reduce((prev, cur) => {
            const edge = cur as Edge
            prev[edge.target] = edge
            return prev
        }, {} as Record<string, Edge>)

        const rootArr = flow.elements.filter(element => element.data.formType === 'entry')


        if(!rootArr|| rootArr.length !== 1) {
            return
        }

        const root = rootArr[0]


        console.log('root', root)

        return
        // If we set `/users/marie` to {name: "Marie"} then
        // context.params.userId == "marie"
        // ... and ...
        // change.after.data() == {name: "Marie"}
    })
