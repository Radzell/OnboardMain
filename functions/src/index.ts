import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import * as cors from 'cors'

admin.initializeApp()

const corsHandler = cors({origin: true});

interface Flow {
    name?: string
    color?: string
    tagLine?: string
    elements: any[]

}

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const getFlow = functions.https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
		const flowId = req.query.flowId as string

        console.log('flowId', flowId)
        if(!flowId) {
            res.status(400).send("invalid flowId")
            return
        }

        const flowSnap = await admin.firestore().collection(`/flows`).doc(flowId).get()

        if(!flowSnap.exists) {
            res.status(400).send("invalid flowId")
            return
        }

        const flow = flowSnap.data() as Flow

        functions.logger.info("Hello flow", flow);


        res.send(flow);
    })
});
