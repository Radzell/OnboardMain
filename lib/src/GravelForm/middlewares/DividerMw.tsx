import * as React from 'react';
import { Divider, Flex, Text } from '@chakra-ui/react';
import { MiddlewareProps } from '../share';

export const DividerMw: React.FC<MiddlewareProps> = (props) => {
  const { schema } = props;

  //@ts-ignore
  if (schema.text) {
    //@ts-ignore
    const text = schema.text
    return (
      <Flex align="center">
        <Divider />
        <Text padding="2">{text}</Text>
        <Divider />
      </Flex>
    )
  }
  return (
    <Divider />
  );
};

export default DividerMw;
