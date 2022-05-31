import * as React from 'react';
import get from 'lodash/get';
import { Button, Input, InputGroup, InputRightElement, Textarea } from '@chakra-ui/react';
import { MiddlewareProps } from '../share';

export const InputMw: React.FC<MiddlewareProps> = (props) => {
  const { next, schema, data, onChange, extraProps, size, formProps } = props;
  
  if (typeof schema === 'boolean' || schema.type !== 'string') return next(props);
  return (
    <Input
      size={size || formProps.size}
      value={data || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value || undefined);
      }}
      {...get(extraProps, 'props')}
    />
  );
};

export const TextAreaMw: React.FC<MiddlewareProps> = (props) => {
  const { next, schema, data, onChange, extraProps, size, formProps } = props;
  if (typeof schema === 'boolean' || schema.type !== 'string') return next(props);
  return (
    <Textarea
      size={size || formProps.size}
      value={data || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value || undefined);
      }}
      {...get(extraProps, 'props')}
    />
  );
};

export const PasswordMw: React.FC<MiddlewareProps> = (props) => {
  const { next, schema, data, onChange, extraProps, size, formProps  } = props;
  if (typeof schema === 'boolean' || schema.type !== 'string') return next(props);

  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        size={size || formProps.size}
        value={data || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value || undefined);
        }}
        {...get(extraProps, 'props')}
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default InputMw;
