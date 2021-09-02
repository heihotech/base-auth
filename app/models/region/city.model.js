module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define(
    "cities",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provinceId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  return City;
};
