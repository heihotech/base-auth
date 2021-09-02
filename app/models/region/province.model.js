module.exports = (sequelize, Sequelize) => {
  const Province = sequelize.define(
    "provinces",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  return Province;
};
