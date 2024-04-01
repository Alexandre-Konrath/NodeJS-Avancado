    - iniciar o servidor -
    yarn dev
    yarn queue

    abrir o docker desktop e dps abrir o http://localhost:8000/browser/

    const customer = await Customer.findAll();
    // customer.destroy();
    // const customer = await Customer.findByPk(1);
    // console.log("Antes", JSON.stringify(customer, null, 2));
    // const newcustomer = await customer.update({ status: "ACTIVE" });
    // console.log("Depois", JSON.stringify(newcustomer, null, 2));
    // const customer = await Customer.create({
    //   name: "teste 1",
    //   email: "teste1@gmail.com",
    // });
    // const customers = await Customer.findByPk(2);
    // const customers = await Customer.findOne({
    //   attributes: { exclude: ["status"] },
    // });
    // const customers = await Customer.scope("active").findAll({
    //   include: [
    //     {
    //       model: Contact,
    //       where: {
    //         status: "ACTIVE",
    //       },
    //       required: false,
    //     },
    //   ],
    //   where: {
    //   [Op.or]: {
    //     status: {
    //       [Op.in]: ["ACTIVE", "ARCHIVED"],
    //     },
    //     name: {
    //       [Op.like]: "github",
    //     },
    //   },
    //   name: {
    //     [Op.like]: "github",
    //   },
    //     createdAt: {
    //       [Op.between]: [new Date(2024, 1, 1), new Date(2024, 12, 31)],
    //     },
    //   },
    //   order: [["createdAt"]],
    // limit: 5,
    // offset: 5 * 1 - 5,
    // });
    console.log("Agora", JSON.stringify(customer, null, 2));
