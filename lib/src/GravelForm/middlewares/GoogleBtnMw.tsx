import * as React from 'react';
import get from 'lodash/get';
import { Button, Input, InputGroup, InputRightElement, Textarea } from '@chakra-ui/react';
import { MiddlewareProps } from '../share';
import OAuth2Login from '../utils/OAuth2Login';

export const GoogleBtnMw: React.FC<MiddlewareProps> = (props) => {
  const { next, schema, data, onChange, extraProps, size, formProps } = props;
  if (typeof schema === 'boolean' || schema.type !== 'string') return next(props);

  const onSuccess = response => console.log(response);
  const onFailure = response => console.error(response);
  return (
    <OAuth2Login
      authorizationUrl="https://accounts.spotify.com/authorize"
      responseType="token"
      clientId="9822046hvr4lnhi7g07grihpefahy5jb"
      redirectUri="http://localhost:3000/oauth-callback"
      onSuccess={onSuccess}
      onFailure={onFailure}   />
  );
};


export default GoogleBtnMw;
