module.exports = (sequelize, Sequelize) => {
  const District = sequelize.define(
    "districts",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cityId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  return District;
};
