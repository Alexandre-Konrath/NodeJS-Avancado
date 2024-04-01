import Sequelize, { Model } from "sequelize";

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        status: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
      },
      {
        scopes: {
          active: {
            where: {
              status: "ACTIVE",
            },
          },
        },
        // hooks: {
        //   beforeValidate: (customer, options) => {
        //     customer.status = "ARCHIVED";
        //   },
        // },
        sequelize,
        name: {
          singular: "customer",
          plural: "customers",
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Contact);
  }
}

export default Customer;
