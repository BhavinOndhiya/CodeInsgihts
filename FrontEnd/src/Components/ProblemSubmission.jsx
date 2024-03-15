import React, { useEffect, useState, useRef } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
} from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ResponsiveAppBar from './Navbar';
import { userContext } from '../App';
const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
const ProblemSubmissionPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const lastRowRef = useRef(null);
    const { ContestName, ProblemName } = useParams();
    const { state } = React.useContext(userContext);
    const [index, setIndex] = useState(1);
    const [pages, setPages] = useState(0);
    const [show, setshow] = useState(0);

    useEffect(() => {
        const fetchData = () => {
            fetchSubmissions(index);
        };
        fetchData();
        const timer = setInterval(fetchData, 5000);
        return () => clearInterval(timer);
    }, [index]); // Dependency array with index
    async function fetchSubmissions(index) {
        const res = await axios.get(`/Submissions/${index}/${ContestName}/${ProblemName}`);
        if (res.data.status === 200) {
            setSubmissions([...res.data.Data]);
            setPages(res.data.Pages);
            setshow(res.data.show);
        }
    }

    const handlePageChange = async (event, newPage) => {
        setIndex(newPage);
    }


    const getVerdictColor = (verdict) => {
        switch (verdict) {
            case 'AC':
                return { color: 'green', text: 'Accepted' };
            case 'WA':
                return { color: 'red', text: 'Wrong Answer' };
            case 'TLE':
                return { color: 'orange', text: 'Time Limit Exceeded' };
            case 'CE':
                return { color: 'blue', text: 'Compilation Error' };
            // Add more cases for other verdicts as needed
            default:
                return { color: 'black', text: verdict };
        }
    };


    return (
        <>
            <ResponsiveAppBar />
            <Container style={{ marginTop: '7rem' }} maxWidth="lg">
                <center>
                    <Typography variant="h4" style={{ color: 'primary' }} gutterBottom>
                        Submissions for <Link to={`/Problem/${ContestName}/${ProblemName}`}>{ProblemName}</Link>
                    </Typography>
                </center>
                <Paper>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Submission ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Problem Name</TableCell>
                                    <TableCell>Verdict</TableCell>
                                    <TableCell>Language</TableCell>
                                    <TableCell>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.map((submission, index) => (
                                    <TableRow
                                        style={{ backgroundColor: state.UserName === submission.UserName ? '#bacbff' : '' }}
                                        key={index}
                                        ref={index === submissions.length - 1 ? lastRowRef : null}
                                    >
                                        <TableCell>
                                            {(show&&state.UserName !== submission.UserName) ? <Typography>{submission.Submissionid}</Typography> : <Link to={`/Solution/${submission.Submissionid}`}>
                                                {submission.Submissionid}
                                            </Link>}
                                        </TableCell>
                                        <TableCell>{new Date(submission.Date).toLocaleDateString('en', options)}</TableCell>
                                        <TableCell>{submission.UserName}</TableCell>
                                        <TableCell>{submission.ProblemName}</TableCell>
                                        <TableCell>
                                            <Typography
                                                style={{
                                                    color: getVerdictColor(submission.verdict).color,
                                                }}
                                            >
                                                {getVerdictColor(submission.verdict).text}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                            >
                                                {submission.Language === 'cpp' ? 'C++' : submission.Language || 'C++'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{submission.Time} ms</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        count={pages}
                        page={index}
                        onChange={handlePageChange}
                        component="div"
                    />
                </Paper>
            </Container>
        </>
    );
};

export default ProblemSubmissionPage;
