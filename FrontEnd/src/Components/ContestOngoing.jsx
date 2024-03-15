import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import { styled } from "@mui/system";
import { PiUsersBold } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";
import TimerOnCell from "./TimerOnGoining";
import ResponsiveAppBar from "./Navbar";
import axios from "axios"; // Import axios for making HTTP requests
import { userContext } from "../App";

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: theme.palette.primary.light,
}));

const OnGoingProblemList = () => {
  const [ProblemList, setProblemList] = useState([]);
  const [EndTime, setEndTime] = useState("");
  const { ContestName } = useParams(); // Destructure ContestName from useParams
  const { state } = React.useContext(userContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  useEffect(() => {
    async function fetchDetails() {
      try {
        const result = await axios.get(`/ProblemList/${ContestName}`); // Use axios to fetch data
        const res = result.data;
        if (res.status === 200) {
          setProblemList(res.Data);
          setEndTime(res.EndTime);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchDetails();
  }, [ContestName]); // Include ContestName in the dependency array

  useEffect(() => {
    // Function to log key presses
    const logKeyPress = async (event) => {
      const timestamp = new Date().toISOString();
      try {
        // Log only 'Esc', 'F11', and 'Alt+Tab' key presses
        if (
          event.key === "Escape" ||
          event.key === "F11" ||
          (event.altKey && !event.ctrlKey)
        ) {
          // Send key press data to the backend
          setSnackbarOpen(true)
          let key = "";
          if (event.altKey && !event.ctrlKey) {
            key = "Alt+Tab";
          } else {
            key = event.key;
          }
          await axios.post("/logs", {
            key,
            timestamp,
            ContestName: ContestName,
            UserName: state.UserName,
          });
          console.log("Key press logged successfully");
        }
      } catch (error) {
        console.error("Error logging key press:", error);
      }
    };

    // Event listener for keydown event
    const handleKeyDown = (event) => {
      logKeyPress(event);
    };

    // Event listener for keyup event
    const handleKeyUp = (event) => {
      logKeyPress(event.key);
    };

    
    // Add event listeners when the component mounts
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners when the component unmounts
    return () => {
      // Remove event listeners only when the component unmounts
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }); // Include ContestName in the dependency array
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <ResponsiveAppBar />
      <center>
        <Grid item xs={12}>
          <Typography
            sx={{ marginTop: "7rem" }}
            color={"primary"}
            variant="h3"
            gutterBottom
          >
            {ContestName}
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <TableContainer
              component={Paper}
              sx={{ marginTop: "2rem", maxWidth: "md" }}
            >
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell colSpan={12}>
                      <Typography color={"white"} variant="h6" gutterBottom>
                        Problem Name
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                      <Typography
                        color={"white"}
                        sx={{ textAlign: "end" }}
                        variant="h6"
                        gutterBottom
                      >
                        Correct Submission
                      </Typography>
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {ProblemList.map((problem, index) => (
                    <TableRow key={index}>
                      <TableCell  colSpan={12}>
                        <Link
                          
                          to={`/ProblemOngoing/${ContestName}/${problem.ProblemName}`}
                        >
                          <Typography variant="h6" gutterBottom>
                            {problem.ProblemName}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell colSpan={1}>
                        <Link
                          to={`/Submissions/${ContestName}/${problem.ProblemName}`}
                        >
                          <Typography
                            sx={{ textAlign: "end" }}
                            variant="h6"
                            gutterBottom
                          >
                            <PiUsersBold /> X{problem.NumberSubmission}
                          </Typography>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={2} sx={{ display: "flex", flexDirection: "column" }}>
            <br />
            <TimerOnCell EndTime={EndTime} Tag={"Time Left"} />
          </Grid>
        </Grid>
        <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity="error"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  You activity will be marked
                </Alert>
              </Snackbar>
      </center>
    </>
  );
};

export default OnGoingProblemList;

// import React, { useEffect, useState } from 'react';
// import { Box, Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
// import ResponsiveAppBar from './Navbar';
// import { styled } from '@mui/system';
// import { PiUsersBold } from "react-icons/pi";
// import { Link, useParams } from 'react-router-dom';
// import TimerCell from './Timer';
// import TimerOnCell from './TimerOnGoining';
// const StyledTableHead = styled(TableHead)(({ theme }) => ({
//     background: theme.palette.primary.light,
// }));

// function OnGoingProblemList() {
//     const [ProblemList, setProblemList] = useState([]);
//     const [EndTime, setEndTime] = useState('');
//     const [contestname] = useState(useParams());
//     useEffect(() => {
//         async function fetchDetails() {
//             try {
//                 const result = await fetch(`/ProblemList/${contestname.ContestName}`);
//                 const res = await result.json();
//                 console.log(res);
//                 if (res.status === 200) {
//                     setProblemList(res.Data);
//                     setEndTime(res.EndTime);
//                 }
//             } catch (e) {
//                 console.error(e);
//             }
//         }
//         fetchDetails();
//     }, []);
//     return (
//         <>
//             <ResponsiveAppBar />

//             <center>
//                 <Grid item xs={12}>
//                     <Typography sx={{ marginTop: '7rem' }} color={'primary'} variant="h3" gutterBottom>
//                         {contestname.ContestName}
//                     </Typography>
//                 </Grid>
//                 <Grid container spacing={2} >
//                     <Grid item xs={3}></Grid>
//                     <Grid item xs={6}>
//                         <TableContainer component={Paper} sx={{ marginTop: '2rem', maxWidth: 'md' }}>
//                             <Table>
//                                 <StyledTableHead>
//                                     <TableRow >
//                                         <TableCell colSpan={12}>
//                                             <Typography color={'white'} variant="h6" gutterBottom>
//                                                 Problem Name
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell colSpan={1}>
//                                             <Typography color={'white'} sx={{ textAlign: 'end' }} variant="h6" gutterBottom>
//                                                 Correct Submission
//                                             </Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 </StyledTableHead>
//                                 <TableBody>
//                                     {ProblemList.map((problem, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell colSpan={12}> <Link to={`/Problem/${problem.ContestName}/${problem.ProblemName}`}>   <Typography variant="h6" gutterBottom>
//                                                 {problem.ProblemName}
//                                             </Typography></Link></TableCell>
//                                             <TableCell colSpan={1}> <Link to={`/Submissions/${problem.ContestName}/${problem.ProblemName}`}>   <Typography sx={{ textAlign: 'end' }} variant="h6" gutterBottom>
//                                                 <PiUsersBold /> X{problem.NumberSubmission}
//                                             </Typography></Link></TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Grid>
//                     <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column' }}>
//                         <br />
//                         <Card>
//                             {EndTime && <TimerOnCell EndTime={EndTime} Tag={'Time Left'} />}
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </center>
//         </>);
// }
// export default OnGoingProblemList;
