const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users.model");

function getAllUsers(req, res, next) {
  return selectAllUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
}

function getUserByUsername() {
  return selectUserByUsername(username);
}

module.exports = { getAllUsers, getUserByUsername };
