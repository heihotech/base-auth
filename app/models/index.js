const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.profile = require("./profile.model")(sequelize, Sequelize);
db.userRole = require("./mn/userRole.model.js")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model.js")(sequelize, Sequelize);

// region
db.province = require("./region/province.model.js")(sequelize, Sequelize);
db.city = require("./region/city.model.js")(sequelize, Sequelize);
db.district = require("./region/district.model.js")(sequelize, Sequelize);
db.village = require("./region/village.model.js")(sequelize, Sequelize);
db.address = require("./region/address.model.js")(sequelize, Sequelize);

// create tb user_roles
db.user.belongsToMany(db.role, { through: db.userRole });
db.role.belongsToMany(db.user, { through: db.userRole });
db.refreshToken.belongsTo(db.user);
db.user.hasOne(db.refreshToken);
db.profile.hasOne(db.user);

// region
db.province.hasMany(db.city);
db.city.hasMany(db.district);
db.district.hasMany(db.village);
db.village.hasMany(db.address);
db.address.hasOne(db.profile);

db.ROLES = ["super", "user", "admin", "finance"];

module.exports = db;
