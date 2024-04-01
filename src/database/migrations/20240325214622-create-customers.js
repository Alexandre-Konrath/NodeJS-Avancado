module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("customers", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false, // pode conter nulo
        autoIncrement: true,
        primaryKey: true, // chave primaria
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // email unico
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: (queryInterface) => queryInterface.dropTable("customers"),
};
