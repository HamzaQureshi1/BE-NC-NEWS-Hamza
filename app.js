const express = require("express");
const apiRouter = require("./routes/apiRouter");
const { invalidRoute } = require("./error-handler/error-handler");
const { handle405Errors } = require("./error-handler/error-handler");
const { handleCustomErrors } = require("./error-handler/error-handler");
const { psqlErrors } = require("./error-handler/error-handler");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", invalidRoute);
app.use(handleCustomErrors);
app.use(psqlErrors);
app.use(handle405Errors);

// app.all("/api",(req, res, next) => {
// console.log("hello");
// res.status(4).send({ msg: "Method denied." });
// });

module.exports = app;
