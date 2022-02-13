import * as React from 'react'
import { DashboardLayout } from '../../components/dashboard-layout';
import { FlowBuilderChart } from '../../components/flowbuilder/flowbuilder-chart';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Typography, Button, Grid, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect, useState, useMemo } from 'react';
import { useFirestoreConnect } from 'react-redux-firebase';
import NextLink from 'next/link';
import {createNewFlow} from '../../reducers/flowChartSlice'
import { useSnackBar } from '../../components/snackbar';

const card = ({flow, flowId}) => {
    console.log('flow', flow)
    return (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          {flow?.name}
        </Typography>
      </CardContent>
      <CardActions>
      <NextLink
            href={`/flowbuilder/${flowId}`}
            passHref
          >
            <Button size="small">Edit</Button>
        </NextLink>
      </CardActions>
    </React.Fragment>
  );
}

const FlowbuilderCollection = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>()

  const auth = useAppSelector(state => state.firebase.auth)
  const dispatch = useAppDispatch()

  const userId = auth.uid

  const junctionUserOrg = useAppSelector(
    ({ firestore: { data } }) => data.junction_user_org
  )

  const organizations = useAppSelector(
    ({ firestore: { data } }) => {
      return data.organization ?? {}
    }
  )

  const flows = useAppSelector(
    ({ firestore: { data } }) => {
      console.log('flows fl', data.flows)
      return data.flows ?? {}
    }
  )


  const organization = useMemo(() => {
    if(!selectedOrgId || !organizations) {
      return null
    }
    return organizations[selectedOrgId]
  }, [selectedOrgId])

  const flowIds: any[] = useMemo(() => {
    return organization?.flows ?? []
  }, [organization])

  console.log('flow', flowIds, flows)


  useFirestoreConnect(() => {

    const result = []
    const junctions = Object.values(junctionUserOrg ?? {}).map((junction) => {
      return {
        collection: 'organization',
        doc: junction.orgId
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

    if(flowIds) {
      const flowRes = flowIds.map(flowId => {
        return {
          collection: 'flows',
          doc: flowId
        }
      })

      result.push(...flowRes)
    }

    console.log('useFirestore', result)

    return result
  })


  const snackbar = useSnackBar()

 

  useEffect(() => {
    if(!selectedOrgId && !!organizations) {
      setSelectedOrgId(Object.keys(organizations)[0])
    }
  },[organizations])

  const onCreateNewFlow = () => {
    if(selectedOrgId) {
      dispatch(createNewFlow({orgId: selectedOrgId}))
      snackbar.showSnackBar("Creating Flow...", "info")

    } else {
      snackbar.showSnackBar("Error Creating Flow...", "error")
    }
  }

  
  return <div style={{ height: '100%' }}>
    <Box sx={{ flexGrow: 1, padding: 6 }}>
      <Button onClick={onCreateNewFlow} sx={{marginBottom: 8}} variant="contained">Create New Flow</Button>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {Object.keys(flows ?? {}).map((flowId, index) => (
          <Grid item xs={2} sm={4} md={4}
key={index}>
            <Card variant="outlined">{card({flow: flows[flowId], flowId})}</Card>
          </Grid>
        ))}
      </Grid>
    </Box>

  </div>
}

FlowbuilderCollection.getLayout = (page: any) => (
  <DashboardLayout>

    {page}
  </DashboardLayout>
);


export default FlowbuilderCollection;