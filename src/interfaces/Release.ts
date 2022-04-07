import { Timestamp } from "firebase/firestore"
import { Flow } from "../app/store"


type ReleaseStatus = "Current" | "Deployed" | "Rollback"
export interface Release {
    status: ReleaseStatus,
    createdAt: Timestamp,
    flow:Flow,
    flowId: string,
    settings: any,
    releaseId?: string
}