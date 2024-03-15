const express = require("express");
const app = express();
const fs = require("fs");
var bodyParser = require("body-parser");
const auth = require("./auth/auth");
const path = require("path");
const cookieparser = require("cookie-parser");
const token = require("./auth/AuthToken");
const leaderboard = require("./Database/GetData/GetUserData");
const GetContestData = require("./Contest/GetContest");
const Problem = require("./Contest/GetProblem");
const GetData = require("./Database/GetData/Submissions");
const standing = require("./Database/GetData/GetStandings");
const AddContest = require("./Contest/AddContest");
const multer = require("multer");
const { createLogger, transports, format } = require("winston");
const { combine, timestamp, label, printf } = format;
const cors = require("cors");
app.use(cors());
const Problemsubmit = require("./CompileCode/compile");
const AddProblem = require("./Contest/AddProblem");
const AddData = require("./Database/AddData/AddData");
const expressSession = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(expressSession);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
mongoose
  .connect("mongodb://127.0.0.1:27017/CodeInsights")
  .then(() => console.log("Connection sucessfull....."))
  .catch((err) => console.log(err));
const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/CodeInsights",
  collection: "sessions",
});
app.use(
  expressSession({
    secret: "TheCodinsightsSession",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: 24 * 3600000 },
  })
);
// Define a custom Winston format
// const myFormat = printf(({ level, message}) => {
//   return `${level}: ${message}`;
// });

// Create a daily rotating file transport for Winston
// const logger = createLogger({
//   // format: combine(timestamp(), myFormat),
//   format: combine(
//     timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
//     myFormat
//   ),
//   transports: [
//     new transports.File({
//       filename: `logs/%DATE%.log`,
//       datePattern: "YYYY-MM-DD",
//       prepend: true,
//       json: false,
//       zippedArchive: true,
//       maxSize: "5m",
//       maxFiles: "1d",
//     }),
//   ],
// });

// Custom format for logging messages
const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Function to create a logger for an individual user
const createUserLogger = (userId, contestName) => {
  // Define the directory path for the user's logs
  const logDir = path.join(__dirname, "logs", contestName);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Create a logger instance for the user
  const logger = createLogger({
    format: format.combine(
      format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      myFormat
    ),
    transports: [
      // Log to a file for the user
      new transports.File({
        filename: path.join(logDir, `${userId}.log`),
        json: false,
      }),
    ],
  });

  return logger;
};

app.post("/addquestion", async (req, res) => {
  console.log(req.body);
});

app.get("/token", async (req, res) => {
  if (req.session.token) {
    const sessiontoken = req.session.token;
    const result = await token.GetTokenDetails(sessiontoken);
    res.send(result);
  } else {
    res.send({ login: false });
  }
});
app.get("/Contest", async (req, res) => {
  const CompletedContest = await GetContestData.GetCompletedContestList();
  const UpcomingContest = await GetContestData.GetUpcomingContestList();
  const OnGoingProblemList = await GetContestData.GetOnGoingContestList();
  res.send({
    status: 200,
    OnGoingProblemList:
      OnGoingProblemList.status === 200 ? OnGoingProblemList.Data : 402,
    CompletedContest:
      CompletedContest.status === 200 ? CompletedContest.Data : 402,
    UpcomingContest:
      UpcomingContest.status === 200 ? UpcomingContest.Data : 402,
  });
});
app.get("/ProblemList/:Contest", async (req, res) => {
  const ProblemList = await Problem.GetProblemList(req.params.Contest);
  res.send(ProblemList);
});
app.get("/Standing/:id/:ContestName", async (req, res) => {
  const result = await standing.GetStandings(
    req.params.id,
    req.params.ContestName
  );
  res.send({ status: 200, Data: result });
});
app.get("/leaderboard", async (req, res) => {
  const result = await GetData.getuserdata();
  result.sort((a, b) => b.total - a.total);
  res.json(result);
});
app.post("/SignUP", async (req, res) => {
  const data = req.body;
  const result = await auth.register(data);
  res.send(result);
});
async function Authenticated(req, res, next) {
  if (req.session.token !== undefined) {
    const sessiontoken = req.session.token;
    const result = await token.GetTokenDetails(sessiontoken);
    req.userName = result.UserName;
    req.id = result.id;
    next();
  } else {
    res.send({ status: 422, message: "Login Required" });
  }
}
app.post("/Submit", Authenticated, async (req, res) => {
  const result = await Problemsubmit.SubmitProblem(req.body, req.userName);
  res.send(result);
});
app.post("/Login", async (req, res) => {
  const data = req.body;
  const result = await auth.login(data, req, res);
  if (result.status === 200) {
    req.session.token = result.token;
  }
  res.send({ status: result.status, message: result.message });
});
app.get("/logout", Authenticated, async (req, res) => {
  const result = await auth.logout(req.id);
  try {
    req.session.destroy();
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});
app.get("/UserList", async (req, res) => {
  const result = await leaderboard.getuserdata();
  result.sort((a, b) => b.total - a.total);
  res.send({ status: 200, Data: result });
});
app.get("/Problem/:ContestName/:ProblemName", async (req, res) => {
  const ContestName = req.params.ContestName;
  const ProblemName = req.params.ProblemName;
  const result = await Problem.GetProblem(ContestName, ProblemName);
  res.send(result);
});
app.get("/Submissions/:id/:ContestName", async (req, res) => {
  const id = req.params.id;
  const ContestName = req.params.ContestName;
  const result = await GetData.GetContestSubmissions(id, ContestName);
  res.send(result);
});
app.get("/Submission/:id/:UserName", async (req, res) => {
  const id = req.params.id;
  const UserName = req.params.UserName;
  const result = await GetData.GetUserSubmissions(id, UserName);
  res.send(result);
});
app.get("/Submissions/:id/:ContestName/:ProblemName", async (req, res) => {
  const id = req.params.id;
  const ContestName = req.params.ContestName;
  const ProblemName = req.params.ProblemName;
  const result = await GetData.GetProblemSubmissions(
    id,
    ContestName,
    ProblemName
  );
  res.send(result);
});
app.get("/Solution/:id", async (req, res) => {
  const id = req.params.id;
  const result = await GetData.GetParticularSubmission(id);
  res.send(result);
});

app.get("/Profile/:id", async (req, res) => {
  const id = req.params.id;
  const result = await leaderboard.GetParticularUserData(id);
  res.send(result);
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });
// Route to handle incoming log data
// app.post("/logs", (req, res) => {
//   console.log(req.body);
//   const { key, timestamp, UserName } = req.body; // Assuming log data is sent as JSON
//   const msg = "pressed :" + key +" " +"Username :" + UserName;

//   logger.info(` ${timestamp}: ${msg}`);
//   res.sendStatus(200);
// });

// Route to handle logging
app.post("/logs", async (req, res) => {
  const { ContestName, UserName, key } = req.body;
  const logger = createUserLogger(UserName, ContestName);

  const result = await AddData.AddFlag(UserName, ContestName);

  // Log the request parameters
  logger.info(`user : ${UserName} key pressed : ${key}`);
  res.send(result);
});
app.post("/upload", upload.array("file"), (req, res) => {
  try {
    if (req.files.length === 0) {
      throw new Error("No files were uploaded.");
    }
    res.status(200).send({ status: 200, message: "Uploaded successfully" });
  } catch (error) {
    console.error("Error during file upload:", error.message);
    res
      .status(500)
      .send({ status: 500, message: "Internal server error during upload." });
  }
});
app.post("/addproblem", async (req, res) => {
  const result = await AddProblem.handleFileUpload(req, res);
  res.send(result);
});
app.post("/AddContest", async (req, res) => {
  const data = req.body;
  const result = await AddContest.AddContest(data);
  res.send({ status: 200, Data: result });
});
app.get("/GetContestNames", async (req, res) => {
  const result = await AddContest.GetContestNames();
  res.send(result);
});
app.get("/UserProfile", async (req, res) => {
  if (req.session.token) {
    const TokenDetails = await token.GetTokenDetails(req.session.token);
    const result = await leaderboard.GetParticularUserData(TokenDetails.id);
    if (result.status === 422) {
      res.send(result);
    } else {
      res.send({ status: 200, Data: result });
    }
  } else {
    res.send({ status: 422, Data: "Login Required" });
  }
});
app.listen(5000, () => {
  console.log("Listening on port 5000...............");
});
