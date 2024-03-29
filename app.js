const express = require("express");
const {
  psqlErrors,
  customErrors,
  serverError,
  invalidRoute,
} = require("./middleware/errorHandlers");
const apiRouter = require("./routes/api-router");

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.all("*", invalidRoute);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverError);

module.exports = app;
