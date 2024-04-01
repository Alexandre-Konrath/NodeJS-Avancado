import * as yup from "yup";
import { parseISO } from "date-fns";
import { Op } from "sequelize";

import Customer from "../models/Customer";
import Contact from "../models/Contact";

// const customers = [
//   { id: 1, nome: "google", site: "https://google.com" },
//   { id: 2, nome: "youtube", site: "https://youtube.com" },
//   { id: 3, nome: "twitch", site: "https://thaisa.com" },
//   { id: 4, nome: "github", site: "https://github.com" },
// ];

class CustomersController {
  // Listagem dos Customers
  async index(req, res) {
    const {
      name,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.page || 25;

    let where = {};
    let order = {};

    if (name) {
      where = {
        ...where,
        name: {
          [Op.iLike]: name,
        },
      };
    }

    if (email) {
      where = {
        ...where,
        email: {
          [Op.iLike]: email,
        },
      };
    }

    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(",").map((item) => item.toUpperCase()),
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdAfter),
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdBefore),
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(updatedAfter),
        },
      };
    }

    // campos de ordenação
    // localhost:3000?sort=id:desc,name
    if (sort) {
      order = sort.split(",").map((item) => {
        const [field, direction] = item.split(":");
        return [field, direction.toUpperCase()]; // Garanta que a direção da ordenação esteja em maiúsculas
      });
    } else {
      order = [];
    }

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          attributes: ["id", "name", "status"],
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });
    return res.json(data);
  }

  // Recupera um Customer pelo id
  async show(req, res) {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json();
    }
    return res.json(customer);
  }

  // Cria um novo Customer
  async create(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      status: yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Erro ao validar o squema" });
    }

    const customer = await Customer.create(req.body);

    return res.status(201).json(customer);
  }

  // Atualiza um Customer
  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      status: yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Erro ao validar o squema" });
    }

    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await customer.update(req.body);

    return res.json(customer);
  }

  // Exclui um Customer
  async destroy(req, res) {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await customer.destroy();

    return res.json({ erro: "Cliente deletado com sucesso" });
  }
}

export default new CustomersController();
