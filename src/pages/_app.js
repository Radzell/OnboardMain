import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import store from '../app/store'
import { Provider } from 'react-redux'
import {
  ReactFlowProvider
} from 'react-flow-renderer';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { createFirestoreInstance } from 'redux-firestore'
import fbConfig from '../database/fbConfig'
import {
  ReactReduxFirebaseProvider
} from 'react-redux-firebase'

import { AuthUserProvider } from '../database/FirebaseAuthContext'


const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}


const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
}

console.log('firebase', firebase)
firebase.initializeApp(fbConfig)

firebase.firestore()
// firebase.functions() // <- needed if using httpsCallable


const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Onboard OS
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>

      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <AuthUserProvider>
            <ReactFlowProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  {getLayout(<Component {...pageProps} />)}
                </ThemeProvider>
              </LocalizationProvider>
            </ReactFlowProvider>
          </AuthUserProvider>
        </ReactReduxFirebaseProvider>
      </Provider>
    </CacheProvider>
  );
};

export default App;
