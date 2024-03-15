import React, { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import ResponsiveAppBar from "./Navbar";
import { userContext } from "../App";
const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};
const SubmissionPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [index, setIndex] = useState(1);
  const lastRowRef = useRef(null);
  const { state } = React.useContext(userContext);

  useEffect(() => {
    fetchSubmissions(index);
    
  }, [index]);
  
    
  async function fetchSubmissions(index) {
    const res = await axios.get(`/Submission/${index}`);
    if (res.data.status === 200) {
      setSubmissions([...submissions, ...res.data.Data]);
    }
  }

  const handleIntersection = (entries) => {
    if (entries[0].isIntersecting) {
      setIndex(index + 1);
      fetchSubmissions(index);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (lastRowRef.current) {
      observer.observe(lastRowRef.current);
    }

    return () => {
      if (lastRowRef.current) {
        observer.unobserve(lastRowRef.current);
      }
    };
  }, [lastRowRef.current]);

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "AC":
        return { color: "green", text: "Accepted" };
      case "WA":
        return { color: "red", text: "Wrong Answer" };
      case "TLE":
        return { color: "orange", text: "Time Limit Exceeded" };
      case "CE":
        return { color: "blue", text: "Compilation Error" };
      // Add more cases for other verdicts as needed
      default:
        return { color: "black", text: verdict };
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container style={{ marginTop: "5rem" }} maxWidth="lg">
        <center>
          <Typography variant="h2" style={{ color: "primary" }} gutterBottom>
            Submissions
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
                    style={{
                      backgroundColor:
                        state.UserName === submissions.UserName
                          ? "#bacbff"
                          : "",
                    }}
                    key={index}
                    ref={index === submissions.length - 1 ? lastRowRef : null}
                  >
                    <TableCell>
                      <Link to={`/Submision/${submission.Submissionid}`}>
                        {submission.Submissionid}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(submission.Date).toLocaleDateString(
                        "en",
                        options
                      )}
                    </TableCell>
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
                      <Typography>
                        {submission.Language === "cpp"
                          ? "C++"
                          : submission.Language || "C++"}
                      </Typography>
                    </TableCell>
                    <TableCell>{submission.Time} ms</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </>
  );
};

export default SubmissionPage;
