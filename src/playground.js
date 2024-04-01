import { Op } from "sequelize";
import Customer from "./app/models/Customer";
import "./database";
import Contact from "./app/models/Contact";

class Playground {
  static async play() {
    const customer = await Customer.findAll({
      order: [["id", "ASC"]],
      where: {
        createdAt: {
          [Op.between]: [new Date(2024, 1, 1), new Date(2024, 12, 31)],
        },
      },
    });
    // console.log("Agora -> ", JSON.stringify(customer, null, 2));
  }
}

Playground.play();
