import { Timestamp } from "firebase/firestore"
import { Flow } from "../app/store"


type ReleaseStatus = "Current" | "Deployed" | "Rolled Back"
export interface Release {
    status: ReleaseStatus,
    createdAt: Timestamp,
    flow:Flow,
    flowId: string,
    settings: any
}