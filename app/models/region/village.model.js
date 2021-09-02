module.exports = (sequelize, Sequelize) => {
  const Village = sequelize.define(
    "villages",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      districtId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  return Village;
};
