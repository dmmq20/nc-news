const express = require("express");
const {
  psqlErrors,
  customErrors,
  serverError,
  invalidRoute,
} = require("./middleware/errorHandlers");
const apiRouter = require("./routes/api-router");

// this is a test
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", invalidRoute);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverError);

module.exports = app;
