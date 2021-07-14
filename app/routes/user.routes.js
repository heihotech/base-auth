const { auth } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/super",
    [auth.verifyToken, auth.superRole, auth.checkAuthorized],
    controller.superBoard
  );

  app.get(
    "/api/test/admin",
    [auth.verifyToken, auth.superRole, auth.adminRole, auth.checkAuthorized],
    controller.adminBoard
  );

  app.get(
    "/api/test/finance",
    [auth.verifyToken, auth.superRole, auth.financeRole, auth.checkAuthorized],
    controller.financeBoard
  );
};
