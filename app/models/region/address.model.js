module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "addresses",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      streetName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      villageId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );

  return Address;
};
