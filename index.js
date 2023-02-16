// ./src/index.js

// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config({ path: "./config.env" });
const basicAuth = require("express-basic-auth");

const dbo = require("./src/db/conn.js");
const PORT = process.env.PORT || 3050;
// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
// const ads = [{ title: "Hello, world (again)!" }];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.use(express.urlencoded({ extended: true }));

const { auth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:3050",
  clientID: "0lCs2vw56DHdbeX8vF1vA0EEa4n9JVlv",
  issuerBaseURL: "https://snapscams.us.auth0.com",
};

//Setup sentry for error monitoring.
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
Sentry.init({
  dsn: "https://96f72cf2115e4bf99bd85d3a641f398f@o97713.ingest.sentry.io/6700813",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});
app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

const { requiresAuth } = require("express-openid-connect");

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

//use routes file
app.use(require("./src/routes/routes.js"));

//Swagger stuff
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
app.use(
  "/api/docs",
  basicAuth({
    users: { baxtmann: "baxtmann" },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

var mysql = require("mysql");

// // ecominder.mobi:8087/Drivers/?userName=point&password=aWHHyKKbnDpfny3H&locale=en
// var pool = mysql.createPool({
//   connectionLimit: 100,
//   host: 'ecominder.mobi',
//   port: 8087,
//   user: 'point',
//   password: 'aWHHyKKbnDpfny3H',
//   database: 'basdb'
// });

// let connection = mysql.createConnection({
//   connectionLimit: 100,
//   host: "ecominder.mobi",
//   port: 8087,
//   user: "point",
//   password: "aWHHyKKbnDpfny3H",
//   database: "basdb",
// });

// connection.connect(function (err) {
//   if (err) {
//     return console.error("sql connection error:----------> " + err.message);
//   }
//   console.log("Connected to the MySQL server.");
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// starting the server
dbo.connectToServer(function (err) {
  if (err) {
    process.exit();
  }
  app.listen(PORT, () => {
    // console.log(`Server is running on port: ${PORT}`);
  });
});
