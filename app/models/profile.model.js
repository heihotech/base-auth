module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define(
    "profiles",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      frontTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      backTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bornDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      religion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { paranoid: true }
  );

  return Profile;
};
