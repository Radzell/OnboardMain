import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { useRouter } from 'next/router';
import { useAuth } from '../database/FirebaseAuthContext';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

interface Props {
  children: JSX.Element
}



export const DashboardLayout = (props: Props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const router =  useRouter()

  const paddingTop = router.pathname !== "/flowbuilder/[flowId]" ? 64 : 0

  const { authUser, loading, signOut } = useAuth();

  // Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (!loading && !authUser && router.asPath !== "/secretregister" && router.asPath !== "/secretlogin"){
      router.push('/secretregister')
    }
  }, [loading, authUser, router.pathname])

  return (
    <>
      <DashboardLayoutRoot style={{  paddingTop }}>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
     {router.pathname !== "/flowbuilder/[flowId]"  && <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} /> }
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </>
  );
};
