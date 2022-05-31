import { JSONSchema7Definition } from "json-schema"
import { MiddlewareProps } from "../share"

export type OnboardOSSchema7Definition = JSONSchema7Definition & {
    text?: string
}

export interface OnBoardOSMiddlewareProps extends MiddlewareProps {
    schema: OnboardOSSchema7Definition
}