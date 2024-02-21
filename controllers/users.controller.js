const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users.model");
const { checkExists } = require("./utils");

function getAllUsers(req, res, next) {
  return selectAllUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  return Promise.all([
    checkExists("users", "username", username),
    selectUserByUsername(username),
  ])
    .then(([_, user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

module.exports = { getAllUsers, getUserByUsername };
