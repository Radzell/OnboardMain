import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';
import { IInput } from '@chakra-ui/react';
import {
  MiddlewareProps as CoreMiddlewareProps,
  FormProps as CoreFormProps,
  ExtraPropsFormProps,
  ExtraPropsMiddlewareProps,
} from './core';

export type ErrorObject = Ajv.ErrorObject;

const ajv = new Ajv({
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: undefined,
});

export function validate(schema: JSONSchema7, data: any) {
  ajv.validate(schema, data);
  return ajv.errors;
}

export interface FormProps extends CoreFormProps, ExtraPropsFormProps {
  onSubmit?: (data: unknown) => void;
  extraProps?: unknown;
  defaultData?: unknown;
  size?: IInput['size'];
}

export interface MiddlewareProps<P extends FormProps = FormProps>
  extends CoreMiddlewareProps<P>,
    ExtraPropsMiddlewareProps<P> {
  errors?: ErrorObject[];
  onSubmit?: (data: unknown) => void;
  size?: IInput['size'];
}
