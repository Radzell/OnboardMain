import Ajv, {ErrorObject as AJVErrorObject} from 'ajv';
import { JSONSchema7 } from 'json-schema';
import { InputProps } from '@chakra-ui/react';
import {
  MiddlewareProps as CoreMiddlewareProps,
  FormProps as CoreFormProps,
  ExtraPropsFormProps,
  ExtraPropsMiddlewareProps,
} from './core';

//@ts-ignore
export type ErrorObject = AJVErrorObject;

const ajv = new Ajv({
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: undefined,
});

export function validate(schema: JSONSchema7, data: any) {
  ajv.validate(schema, data);
  console.log("ajv message")
  return ajv.errors;
}

export interface FormProps extends CoreFormProps, ExtraPropsFormProps {
  onSubmit?: (data: unknown) => void;
  extraProps?: unknown;
  defaultData?: unknown;
  size?: InputProps['size'];
}

export interface MiddlewareProps<P extends FormProps = FormProps>
  extends CoreMiddlewareProps<P>,
    ExtraPropsMiddlewareProps<P> {
  errors?: ErrorObject[];
  onSubmit?: (data: unknown) => void;
  size?: InputProps['size'];
}
