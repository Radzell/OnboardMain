import { useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import MediationIcon from '@mui/icons-material/Mediation';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useAppSelector } from '../app/hooks';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useFirebaseAuth from '../database/useFirebaseAuth';
import { Organization } from '../interfaces/Organization';
import Image from 'next/image'

const items = [
  {
    href: '/flowbuilder',
    icon: (<MediationIcon fontSize="small" />),
    title: 'Flow Builder'
  },
  {
    href: '/account',
    icon: (<UserIcon fontSize="small" />),
    title: 'Account'
  },
  {
    href: '/settings',
    icon: (<CogIcon fontSize="small" />),
    title: 'Settings'
  }
];

export const DashboardSidebar = (props: { open: any; onClose: any; }) => {


  const [selectedOrgId, setSelectedOrgId] = useState<string>()
  const { open, onClose } = props;
  const router = useRouter();
  const { signOut } = useFirebaseAuth()
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const auth = useAppSelector(state => state.firebase.auth)

  const userId = auth.uid

  const junctionUserOrg = useAppSelector(
    ({ firestore: { data } }) => data.junction_user_org
  )

  useFirestoreConnect(() => {

    const result = []
    const junctions = Object.values(junctionUserOrg ?? {}).map((junction) => {
      return {
        collection: 'organization',
        doc: junction.orgId,
        storeAs: `myOrg-${junction.orgId}`

      }
    })

    if (userId) {
      result.push({
        collection: 'junction_user_org',
        where: [['userId', '==', userId]]
      })
    }

    if (Object.keys(junctions).length > 0) {
      result.push(...junctions)
    }
    
    return result
  })



  const organizations:Organization[] = useAppSelector(
    ({ firestore: { data } }) => {
      return Object.values(junctionUserOrg ?? {}).map((junction) => {
        return {...data[`myOrg-${junction.orgId}`], uid: junction.orgId} as Organization
      })
    }
  )

  useEffect(() => {
    if (!selectedOrgId && !!organizations && organizations.length > 0) {
      setSelectedOrgId(organizations[0].uid)
    }
  }, [organizations])

  const organization = useMemo(() => {
    if (!selectedOrgId || !organizations) {
      return null
    }
    return organizations.find((org) => org.uid == selectedOrgId)
  }, [selectedOrgId, organizations])

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleClick menu', event)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  const goToProfile = () => {
    router.push("/account")
    handleClose()
  }

  const goToLogout = () => {
    signOut()
    handleClose()
  }

  const content = (
    <>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem sx={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }} onClick={goToProfile}>Profile</MenuItem>
          <MenuItem sx={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }} onClick={goToLogout}>Logout</MenuItem>
        </Menu>
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/"
              passHref
            >
              <a>
                <Logo
                width={42} height={42}
                  sx={{
                    height: 42,
                    width: 42
                  }}
                />
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              onClick={handleClick}
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  {organization?.name}
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                  Your tier
                  {' '}
                  : Free
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              />
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>

      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
