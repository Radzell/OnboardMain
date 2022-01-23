import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useAuth } from '../database/FirebaseAuthContext' 

import { OnboardOS } from '../../lib/src/index'
import { useOnboardOS } from '../../lib/src/useOnboardOS'

const Register = () => {
  const { createUserWithEmailAndPassword } = useAuth();

  const router = useRouter();
  const osboard = useOnboardOS()

  const onValidate = (stepId:string, stepType:string, data:object) => {

    return false
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
        <Container maxWidth="sm">
          
        <OnboardOS register={osboard.register} onValidate={onValidate} flowId={"main-app_flow"} />
        </Container>
      </Box>
    </>
  );
};

export default Register;
