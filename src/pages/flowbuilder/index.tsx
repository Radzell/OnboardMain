import * as React from 'react'
import { DashboardLayout } from '../../components/dashboard-layout';
import { FlowBuilderChart } from '../../components/flowbuilder/flowbuilder-chart';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Typography, Button, Grid, Box, IconButton, Stack, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect, useState, useMemo } from 'react';
import { useFirestoreConnect } from 'react-redux-firebase';
import NextLink from 'next/link';
import { createNewFlow, duplicateFlow } from '../../reducers/flowChartSlice'
import { useSnackBar } from '../../components/snackbar';
import { Organization } from '../../interfaces/Organization';
import { Flow } from '../../app/store';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const flowFlow = ({ flow, flowId, organizationId }: { flow: Flow, flowId: string, organizationId: string }) => {
  const dispatch = useAppDispatch()
  const snackbar = useSnackBar()

  const onDuplicate = () => {
    dispatch(duplicateFlow({ flowId, organizationId }))

    snackbar.showSnackBar("Duplicating...", "info")
  }

  return (
    <TableRow
      key={flowId}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {flow?.name}
      </TableCell>
      <TableCell align="center">-</TableCell>
      <TableCell align="center" >-</TableCell>
      <TableCell align="center" >-</TableCell>
      <TableCell align="center" >-</TableCell>
      <TableCell align="center">-</TableCell>
      <TableCell align="center">-</TableCell>
      <TableCell align="center">-</TableCell>

      <TableCell align="right"> {process.env.NODE_ENV == "development" && <IconButton onClick={onDuplicate}><ContentCopyIcon /></IconButton>}
        <NextLink
          href={`/flowbuilder/${flowId}`}
          passHref
        >
          <IconButton><EditIcon /></IconButton>
        </NextLink>
      </TableCell>
    </TableRow>
  );
}

const StatItem = ({ name, stat }: { name: string, stat: string }) => {
  return (
    <Grid item xs={2}>
      <Paper>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {stat}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {name}
          </Typography>
        </CardContent>
      </Paper>
    </Grid>
  )
}

const FlowbuilderCollection = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>()

  const auth = useAppSelector(state => state.firebase.auth)
  const dispatch = useAppDispatch()

  const userId = auth.uid

  const junctionUserOrg = useAppSelector(
    ({ firestore: { data } }) => data.junction_user_org
  )

  const organizations: Organization[] = useAppSelector(
    ({ firestore: { data } }) => {

      return Object.values(junctionUserOrg ?? {}).map((junction) => {
        return { ...data[`myOrg-${junction.orgId}`], uid: junction.orgId } as Organization
      })
    }
  )

  const organization = useMemo(() => {
    if (!selectedOrgId || !organizations) {
      return null
    }
    return organizations.find((org) => org.uid == selectedOrgId)
  }, [selectedOrgId, organizations])

  const flowIds: any[] = useMemo(() => {
    return organization?.flows ?? []
  }, [organization])

  const flows = useAppSelector(
    ({ firestore: { data } }) => {
      return flowIds?.map((flowId) => ({ flowId, flow: data[`myFlows-${flowId}`] }))
    }
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

    if (flowIds) {
      const flowRes = flowIds.map(flowId => {
        return {
          collection: 'flows',
          doc: flowId,
          storeAs: `myFlows-${flowId}`
        }
      })

      result.push(...flowRes)
    }

    return result
  })


  const snackbar = useSnackBar()



  useEffect(() => {
    if (!selectedOrgId && !!organizations && organizations.length > 0) {
      setSelectedOrgId(organizations[0].uid)
    }
  }, [organizations])

  const onCreateNewFlow = () => {
    if (selectedOrgId) {
      dispatch(createNewFlow({ orgId: selectedOrgId }))
      snackbar.showSnackBar("Creating Flow...", "info")

    } else {
      snackbar.showSnackBar("Error Creating Flow...", "error")
    }
  }



  return <div style={{ height: '100%' }}>
    <Box sx={{ flexGrow: 1, padding: 6 }}>

      <Grid container spacing={2} sx={{ marginBottom: 4 }} direction="row" >
        {StatItem({ name: "Views", stat: "~" })}
        {StatItem({ name: "View -> Conversion", stat: "~" })}
        {StatItem({ name: "Churn percent", stat: "~" })}
        {StatItem({ name: "Total conversion", stat: "~" })}
      </Grid>
      <Button onClick={onCreateNewFlow} sx={{ marginBottom: 4 }} variant="contained">Create New Flow</Button>


      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Flows</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>

            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="right">Time spent</TableCell>
              <TableCell align="right">Instant Churn Rate</TableCell>
              <TableCell align="right">Opens per user</TableCell>
              <TableCell align="right">Opens</TableCell>
              <TableCell align="right">Unique Opens</TableCell>
              <TableCell align="right">Conversion Rate</TableCell>
              <TableCell align="right"></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {flows?.map((flowItem) => (
              flowFlow({ flow: flowItem.flow, flowId: flowItem.flowId, organizationId: selectedOrgId })
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

  </div>
}

FlowbuilderCollection.getLayout = (page: any) => (
  <DashboardLayout>

    {page}
  </DashboardLayout>
);


export default FlowbuilderCollection;