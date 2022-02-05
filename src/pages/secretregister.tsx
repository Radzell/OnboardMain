import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { getMessageFromErrorCode, useAuth } from '../database/FirebaseAuthContext'

import { OnboardOS } from '../../lib/src/index'
import { useOnboardOS } from '../../lib/src/useOnboardOS'
import firebase from 'firebase/compat/app'
import { FirebaseError } from '@firebase/util';
import { saveOrganization, saveProfile } from '../reducers/userSlice';
import { useAppDispatch } from '../app/hooks';
import { StepDataRecord } from '../../lib/src/types';

const Register = () => {
  const { createUserWithEmailAndPassword } = useAuth();

  const router = useRouter();
  const osboard = useOnboardOS()

  const validateEmailAndPassword = async (email: string, password: string) => {
    osboard.startLoader("Creating Account...")

    const result = await createUserWithEmailAndPassword(email, password)
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

    if (typeof result === "string") {
      return result
    }

    if (result === true) {
      osboard.stopLoader()
    }

    osboard.stopLoader()
    osboard.goForward()
    return true
  }


  const getDataSet = (data: object) => {
    return new Set<string>(Object.keys(data))
  }

  const onValidate = async (stepId: string, stepType: string, data: object) => {

    if (stepType === "email_and_password") {
      return validateEmailAndPassword(data.email, data.password)
    }

    if (stepType === "create_or_join_org" && getDataSet(data).has("orgJoinLink")) {

      return "coming soon..."
    }

    return true
  }

  const dispatch = useAppDispatch()

  const onEnd = (data: object) => {
    console.log('onEnd', data)

    const endData:StepDataRecord = {
      "d5aeecb9-fcb6-4728-b9a7-e976b354ce19": {
        "data": {},
        "type": "welcome"
      },
      "4cf8d566-7c7b-4023-a34f-612854f74731": {
        "data": {
          "email": "deon@appmn.com",
          "password": "Radzell1"
        },
        "type": "email_and_password"
      },
      "ca555988-ed11-4387-9fe7-928838689f36": {
        "data": {
          "email": "deon@appmn.com",
          "password": "Radzell1",
          "firstName": "Deon",
          "lastName": "Robinson",
          "telephone": "4159363880"
        },
        "type": "profile"
      },
      "74d8b185-7169-4fb7-a27d-03277a9d82db": {
        "data": {
          "organizationName": "Main"
        },
        "type": "create_or_join_org"
      },
      "20d4b83e-9d9f-490b-8a67-61c8b9a94bf2": {
        "data": {
          "organizationName": "Main"
        },
        "type": "end_point"
      }
    }


    const steps = Object.keys(endData).map(stepId => {
      const step = endData[stepId]
      return step
    })

    const org = steps.filter(step => step.type === "create_or_join_org")
    const profile = steps.filter(step => step.type === "profile")
    const emailAndPassword = steps.filter(step => step.type === "email_and_password")


    if(!!org && org.length > 0 && !!org[0].data && !!org[0].data.organizationName) {
      dispatch(saveOrganization({ name: org[0].data.organizationName }))
    }
    
    if(!!profile && profile.length > 0 && !!profile[0].data && !!profile[0].data) {
      dispatch(saveProfile({ firstName: profile[0].data.firstName, lastName:profile[0].data.lastName, phoneNumber:  profile[0].data.telephone, email: emailAndPassword[0].data.email}))
    }


    

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
