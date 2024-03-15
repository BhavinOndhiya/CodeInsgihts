import React, { useContext, useEffect, useState } from 'react';
import { Grid, Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import ResponsiveAppBar from './Navbar';
import { useTheme } from '@mui/material/styles';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { userContext } from '../App';




const difficultyColors = {
    Easy: '#8BC34A',
    Medium: '#FFC107',
    Hard: '#F44336',
};

const ChartCard = ({ title, chartData }) => {
    const theme = useTheme();
    return (
        <Paper elevation={3} style={{ padding: '1.2rem' }} sx={{ padding: 2, boxShadow: `0 0 10px ${theme.palette.primary.main}`, }}>
            <Typography variant="h6" component="div">
                {title}
            </Typography>
            <BarChart
                xAxis={[
                    {
                        id: 'barCategories',
                        data: ['Easy', 'Medium', 'Hard'],
                        scaleType: 'band',
                    },
                ]}
                series={[
                    {
                        data: chartData,
                        color: theme.palette.primary.main,
                    },
                ]}
                width={350}
                height={200}
            />
        </Paper>
    );
}

const InformationCard = ({ title, details }) => {
    const theme = useTheme();
    return (
        <Paper elevation={3} sx={{ padding: 8, boxShadow: `0 0 10px ${theme.palette.primary.main}` }}>
            <Typography variant="h6" component="div" align='center' marginBottom={2} >
                <strong>{title}</strong>
            </Typography>
            {details &&
                Object.entries(details).map(([key, value]) => (
                    <Typography key={key}>
                        <strong>{key}:</strong> {value}
                    </Typography>
                ))}
        </Paper>
    );
}

const Dashboard = () => {
    const theme = useTheme();
    const [loading, setloading] = useState(true);
    const [data, setdata] = useState([]);
    const params = useParams();
    const { state } = useContext(userContext);
    useEffect(() => {
        async function fetch() {
            try {
                const res = await axios.get(`/Profile/${params.id}`);
                setdata(res.data[0]);
                setloading(false);
            }
            catch (e) {
                console.log(e);
            }
        }
        fetch();
    }, [])
    return (
        <>
            <ResponsiveAppBar />
            <Typography style={{ marginTop: '7rem' }} variant='h3' align='center' margin={1} >
                {!loading && <><strong>Summary for</strong> <Link>{data.UserName}</Link></> }
            </Typography>
            {loading ? ( // Show a loading indicator while loading is true
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="500px" // Adjust the height as needed
                >
                    <CircularProgress size={100} />
                </Box>
            ) : <Container maxWidth="xl" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} >
                        <InformationCard
                            title="CodeChef"
                            details={{
                                'Username': data.codechefuser,
                                'Rating': data.codechef.currentRating,
                                'Max Rating': data.codechef.highestRating,
                                'Stars': data.codechef.stars,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InformationCard
                            title="Codeforces"
                            details={{
                                'Username': data.codeforcesuser,
                                'Rank': data.codeforces.result[0].rank,
                                'Max Rank': data.codeforces.result[0].maxRank,
                                'Rating': data.codeforces.result[0].rating,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InformationCard
                            title="LeetCode"
                            details={{
                                'Username': data.leetcodeuser,
                                'Hard Solved': data.leetcode.hardSolved,
                                'Medium Solved': data.leetcode.mediumSolved,
                                'Easy Solved': data.leetcode.easySolved,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginTop: '2rem' }}>
                    <Grid item xs={12} md={2}></Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: 2, boxShadow: `0 0 10px ${theme.palette.primary.main}` }}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Solved Problems
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { value: data.codechef.numberofproblem, color: theme.palette.primary.main, label: 'codehef' },
                                                { value: data.codeforcesSolved, color: 'orange', label: 'codeforces' },
                                                { value: data.leetcode.totalSolved, color: 'yellow', label: 'leetcode' },
                                            ],
                                        },
                                    ]}
                                    width={400}
                                    height={200}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <ChartCard
                            title="LeetCode Solved Problems"
                            chartData={[
                                data.leetcode.easySolved,
                                data.leetcode.mediumSolved,
                                data.leetcode.hardSolved,
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>}
        </>
    );
};

export default Dashboard;
