import { createContext, useContext, Context } from 'react'
import useFirebaseAuth, { User } from './useFirebaseAuth';

interface UserContextInfo { 
  authUser?: User | null,
  loading: boolean
}
const authUserContext = createContext<UserContextInfo>({
  authUser: null,
  loading: true
});

export function AuthUserProvider({ children }: {children: JSX.Element}) {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext);