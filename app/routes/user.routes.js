const { auth, joiVal } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user/",
    [auth.verifyToken, auth.superRole, auth.adminRole, auth.checkAuthorized],
    controller.findAll
  );
  app.get(
    "/api/user/:id",
    [auth.verifyToken, auth.superRole, auth.adminRole, auth.checkAuthorized],
    controller.findOne
  );
  app.post(
    "/api/user/",
    [
      joiVal.validate(joiVal.schemas.user.userCreatePOST),
      auth.verifyToken,
      auth.superRole,
      auth.adminRole,
      auth.checkAuthorized,
    ],
    controller.create
  );
  app.put(
    "/api/user/:id",
    [
      joiVal.validate(joiVal.schemas.user.userUpdatePOST),
      auth.verifyToken,
      auth.superRole,
      auth.adminRole,
      auth.checkAuthorized,
    ],
    controller.update
  );
  app.delete(
    "/api/user/:id",
    [auth.verifyToken, auth.superRole, auth.adminRole, auth.checkAuthorized],
    controller.delete
  );
};
