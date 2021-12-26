import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import uiReducer from '../reducers/uiSlice'
import flowChartReducer from '../reducers/flowChartSlice'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' 
import {
  firebaseReducer
} from 'react-redux-firebase'

export function makeStore() {
  return configureStore({
    reducer: { 
      ui: uiReducer,
      flowChart: flowChartReducer,
      firebase: firebaseReducer,
      firestore: firestoreReducer
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store