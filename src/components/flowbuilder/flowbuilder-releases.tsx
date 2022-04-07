import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Release } from '../../interfaces/Release';
import moment from "moment-timezone"
import { Container, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { rollbackFlow } from '../../reducers/flowChartSlice';
import { useSnackBar } from '../snackbar';

const FlowReleases = ({ flowId }: { flowId: string }) => {
    const snackbar = useSnackBar()

    useFirestoreConnect([
        { collection: `flow-logs/${flowId}/releases`, storeAs: "flowReleases" },

    ])

    const dispatch =  useAppDispatch()

    const sortReleases = (releases: Record<string, Release>) => {
        return Object.keys(releases).map(releaseId => {
            return {
                ...releases[releaseId], 
                releaseId
            }
        }).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    }

    const flowReleases = useAppSelector(
        ({ firestore }): any => sortReleases(firestore.data.flowReleases ?? {}) 
    )

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [releaseId, setRelease] = useState<null | string>(null);

    const open = Boolean(anchorEl);
    const handleClose = () => {
      setAnchorEl(null);
      setRelease(null)
    };

    const handleMenuClick = (releaseId: string) => {
        return (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
            setRelease(releaseId)
        }
    }

    const handleRollback = () => {
        if(releaseId) {
            dispatch(rollbackFlow({flowId, releaseId}))
        }

        snackbar.showSnackBar("Rolling back...", "info")


        handleClose()
    }
    
    return (
        <Container sx={{marginTop: 16}} maxWidth="md">
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleRollback}>Rollback</MenuItem>
            </Menu>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Steps</TableCell>
                            <TableCell align="right"></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flowReleases.map((release:Release, index: number) => (
                            <TableRow
                                key={release.createdAt.seconds}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {release.status}
                                </TableCell>
                                <TableCell align="right">{moment.utc(release.createdAt.seconds*1000).tz(moment.tz.guess()).format("lll")}</TableCell>
                                <TableCell align="right">{release.flow.elements?.length ?? 0}</TableCell>
                                {(release.status !== "Current" && release.status !== "Rollback") && <TableCell align="right"><IconButton onClick={handleMenuClick(release.releaseId)}><MoreVertIcon /></IconButton></TableCell>}

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default FlowReleases