const db = require("../models");
// const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
// const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalUsers, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return { totalUsers, users, totalPages, currentPage };
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
  const { page, size, email, username, name, isInactive } = req.query;
  var condition =
    email || username || name
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { username: { [Op.eq]: username } },
                { email: { [Op.eq]: email } },
                { name: { [Op.eq]: name } },
              ],
            },
          ],
        }
      : {};

  const { limit, offset } = getPagination(page, size);

  await User.findAndCountAll({
    where: condition,
    attributes: { exclude: ["password"] },
    include: {
      model: Role,
      where: {
        name: { [Op.ne]: "super" },
      },
    },
    limit,
    offset,
    paranoid: isInactive === "true" && isInactive != null ? false : true,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Create and Save a new User
exports.create = async (req, res) => {
  const user = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };

  await User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    });
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  await User.findOne({
    where: { id: id },
    attributes: { exclude: ["password"] },
    include: {
      model: db.role,
    },
  })
    .then((data) => {
      if (data != null) {
        res.send(data);
      } else {
        res.send({});
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }

  await User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // update user_roles = delete and then add
        if (req.body.roles) {
          User.findOne({
            where: { id: id },
          })
            .then((user) => {
              Role.findAll({
                where: {
                  name: {
                    [Op.or]: req.body.roles,
                  },
                },
              }).then((roles) => {
                user.removeRoles();
                user.setRoles(roles);
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error retrieving User with id=" + id,
              });
            });
        }
        //
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  await User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};
