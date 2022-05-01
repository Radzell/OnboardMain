import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import uiReducer from '../reducers/uiSlice'
import flowChartReducer from '../reducers/flowChartSlice'
import { createFirestoreInstance, firestoreReducer, FirestoreReducer } from 'redux-firestore' 
import {
  firebaseReducer,
  FirebaseReducer 
} from 'react-redux-firebase'

export interface FlowForm {
  name?: string,
  title?: string,
  description?: string,
  optionA?: string,
  optionB?: string,
  schema?: string,
  validate?: boolean
}
export interface Flow {
  elements?: any[]
  name?: string,
  color?: string,
  tagLine?: string,
  logoName?: string,
  apiKey?: string,
  testApiKey?: string
}

// create schema for the DB
interface DBSchema {
  flows: Flow
  [name: string]: any
}

interface RootState {
  firebase: FirebaseReducer.Reducer<DBSchema>;
  firestore: FirestoreReducer.Reducer<DBSchema>;
  ui: ReturnType<typeof uiReducer>,
  flowChart: ReturnType<typeof flowChartReducer>
}
export function makeStore() {
  return configureStore({
    reducer: combineReducers<RootState>({ 
      ui: uiReducer,
      flowChart: flowChartReducer,
      firebase: firebaseReducer,
      firestore: firestoreReducer
    }),
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