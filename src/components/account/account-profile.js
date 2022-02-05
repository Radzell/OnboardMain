import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
  timezone: 'GTM-7'
};

export const AccountProfile = ({profile}) => {

  const initial = () => {

    if(profile && profile.firstName && profile.lastName) {
      return profile.firstName[0] + profile.lastName[0]
    }

    return "OS"
  }
  return (
  <Card >
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
    
        <Avatar sx={{ height: 64,
            mb: 2,
            width: 64, 
        }}>{initial()}</Avatar>

        <Typography
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {profile.firstName} {profile.lastName}
        </Typography>
      </Box>
    </CardContent>
    <Divider />

  </Card>
  )
};
