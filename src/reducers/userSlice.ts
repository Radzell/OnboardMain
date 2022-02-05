import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from 'firebase/compat/app'

export const saveProfile = createAsyncThunk('user/saveProfile', async ({firstName, lastName, phoneNumber, email}: {firstName: string, lastName:string, phoneNumber: string, email:string}) => {
    const userId = firebase.auth().currentUser?.uid
    console.log('saveProfile', userId, firstName, lastName, phoneNumber)
    await firebase.firestore().collection('profile').doc(userId).set({
        firstName,
        lastName,
        phoneNumber,
        email
      }, { merge: true })
})

export const saveOrganization = createAsyncThunk('user/saveOrganization', async ({name}: {name: string}) => {
    const userId = firebase.auth().currentUser?.uid
    console.log('saveOrganization', userId, name)
    const orgRef = await firebase.firestore().collection('organization').add({
        name,
    })


    const orgId = orgRef.id

    const junctionRef = firebase.firestore().doc(`junction_user_org/${userId}_${orgId}`)
    await junctionRef.set({ orgId, userId });
})

