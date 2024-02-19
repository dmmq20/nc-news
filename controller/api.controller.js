const endpointsData = require("../endpoints.json");

const endpoints = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsData }).catch(next);
};

module.exports = { endpoints };
