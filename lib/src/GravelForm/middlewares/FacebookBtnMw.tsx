import * as React from 'react';
import get from 'lodash/get';
import { Button, Input, InputGroup, InputRightElement, Textarea } from '@chakra-ui/react';
import { MiddlewareProps } from '../share';
import OAuth2Login from '../utils/OAuth2Login';
import FacebookLoginButton from '../utils/FacebookLoginButton';

export const FacebookBtnMw: React.FC<MiddlewareProps> = (props) => {
  const { next, schema, data, onChange, extraProps, size, formProps } = props;

  //@ts-ignore
  if (typeof schema === 'boolean' || schema.type !== 'string' || !schema.clientId) return next(props);

  const onSuccess = async response => {
    const access_token = response.access_token
    const userInfoResp = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
    })
    const jsonResp = await userInfoResp.json()

    await onChange({
      email: jsonResp.email,
      name: jsonResp.name,
      accessToken: access_token
    })

    const onSubmit = props.onSubmit || props.formProps.onSubmit;
    onSubmit({
      email: jsonResp.email,
      name: jsonResp.name,
      accessToken: access_token
    })

};

  const onFailure = response => {
    //console.error("bets onFailure"+response)
  };
  return (
    <OAuth2Login
      authorizationUrl="https://accounts.google.com/o/oauth2/v2/auth"
      responseType="token"
      //@ts-ignore
      clientId={schema.clientId}
      //@ts-ignore
      redirectUri={schema.redirectUri}
      //redirectUri="http://localhost:3000/oauth-callback"
      //scope='openid%20profile%20email'
      //@ts-ignore
      scope={schema.scope}

      isCrossOrigin={false}
      onSuccess={onSuccess}
      onFailure={onFailure}   >
        <FacebookLoginButton>
          <span>{schema.text ?? "Signup with Facebook"}</span>
        </FacebookLoginButton>
      </OAuth2Login>
  );
};


export default FacebookBtnMw;
