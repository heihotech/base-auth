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
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
  const { page, size, email, username, isInactive } = req.query;
  var conditions = [];

  if (username !== "") {
    conditions.push({ username: { [Op.eq]: username } });
  }
  if (email !== "") {
    conditions.push({ email: { [Op.eq]: email } });
  }

  const { limit, offset } = getPagination(page, size);

  await User.findAndCountAll({
    where: {
      [Op.or]: conditions,
    },
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
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };

  db.sequelize
    .transaction(async (t) => {
      const createdUser = await User.create(user, {
        transaction: t,
      });

      if (createdUser) {
        await createdUser.setRoles(req.body.roles);
      }

      return createdUser;
    })
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
        message: err.message || "Error retrieving User",
      });
    });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }

  db.sequelize
    .transaction(async (t) => {
      const updatedUser = await User.update(req.body, {
        where: { id: id },
        transaction: t,
      });

      return updatedUser;
    })
    .then((num) => {
      if (num == 1) {
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
                message: err.message || "Error retrieving User",
              });
            });
        }
        //
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating User",
      });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  db.sequelize
    .transaction(async (t) => {
      const deletedUser = await User.destroy({
        where: { id: id },
        transaction: t,
      });

      return deletedUser;
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete User",
      });
    });
};

exports.deleteAll = (req, res) => {
  db.sequelize
    .transaction(async (t) => {
      const deletedUsers = await User.destroy({
        where: {},
        truncate: false,
        transaction: t,
      });

      return deletedUsers;
    })
    .then((nums) => {
      res.send({ message: `${nums} deleted successfully` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};
