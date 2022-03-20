import { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app'
export interface User {
    uid: string,
    email:string
}
const formatAuthUser = (user: { uid: any; email: any; }): User => ({
  uid: user.uid,
  email: user.email
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState:any) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }

    setLoading(true)
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);    
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  }

  const signInWithEmailAndPassword = (email:string, password:string) =>
    firebase.auth().signInWithEmailAndPassword(email, password);

  const createUserWithEmailAndPassword = (email:string, password:string) =>
    firebase.auth().createUserWithEmailAndPassword(email, password);

  const signOut = () =>
  firebase.auth().signOut().then(clear);

// listen for Firebase state change
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
  };
}