import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useAppSelector } from '../../app/hooks';
import { Release } from '../../interfaces/Release';
import moment from "moment-timezone"
import { Container } from '@mui/material';

const FlowReleases = ({ flowId }: { flowId: string }) => {

    useFirestoreConnect([
        { collection: `flow-log/${flowId}/release`, storeAs: "flowReleases" },

    ])

    const sortReleases = (releases: Record<string, Release>) => {
        return Object.keys(releases).map(releaseId => releases[releaseId]).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    }

    const flowReleases = useAppSelector(
        ({ firestore }): any => sortReleases(firestore.data.flowReleases ?? {}) 
    )

    const renderStatus = (index: number) => {
        if(index === 0) {
            return "Current"
        }
        return "Deployed"
    }
    return (
        <Container sx={{marginTop: 16}} maxWidth="md">

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Steps</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flowReleases.map((release:Release, index: number) => (
                            <TableRow
                                key={release.createdAt.seconds}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {renderStatus(index)}
                                </TableCell>
                                <TableCell align="right">{moment.utc(release.createdAt.seconds*1000).tz(moment.tz.guess()).format("lll")}</TableCell>
                                <TableCell align="right">{release.flow.elements.length}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default FlowReleases