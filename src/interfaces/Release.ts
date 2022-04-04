import { Timestamp } from "firebase/firestore"
import { Flow } from "../app/store"

export interface Release {
    createdAt: Timestamp,
    flow:Flow,
    flowId: string,
    settings: any
}