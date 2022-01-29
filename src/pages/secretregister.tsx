import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { getMessageFromErrorCode, useAuth } from '../database/FirebaseAuthContext' 

import { OnboardOS } from '../../lib/src/index'
import { useOnboardOS } from '../../lib/src/useOnboardOS'
import firebase from 'firebase/compat/app'
import { FirebaseError } from '@firebase/util';

const Register = () => {
  const { createUserWithEmailAndPassword } = useAuth();

  const router = useRouter();
  const osboard = useOnboardOS()

  const onValidate = async (stepId:string, stepType:string, data:object) => {
    console.log('onValidate 2')
    osboard.startLoader("Creating Account...")  
    
    const result = await createUserWithEmailAndPassword(data.email, data.password)
    .then(() => {

    })
    .catch((e: FirebaseError) => {
      const errorMessage = getMessageFromErrorCode(e.code)
      return errorMessage
    }).finally(() => {
      osboard.stopLoader()
    })

    
    console.log('result', result)
    
    console.log('onValidate 3')

    if(typeof result === "string") {
      return result
    }
    
    if(result === true) {
      osboard.stopLoader()
    }

    osboard.stopLoader()
    osboard.goForward()
    return true
  }

  const onEnd = (data: object) => {
    console.log('onEnd', data)
    router.push("/flowbuilder")

  }

  return (
    <>
      <Head>
        <title>
          Register | Onboard OS
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="lg">
        <NextLink
            href="/secretlogin"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Login
            </Button>
          </NextLink>
        <OnboardOS onEnd={onEnd} register={osboard.register} onValidate={onValidate} flowId={"main-app_flow"} />
        </Container>
      </Box>
    </>
  );
};

export default Register;
