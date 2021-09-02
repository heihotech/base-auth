module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define(
    "userRoles",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    },
    {
      paranoid: true,
    }
  );

  return UserRole;
};
