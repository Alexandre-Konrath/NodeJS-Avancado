import * as yup from "yup";
import { parseISO } from "date-fns";
import { Op } from "sequelize";

import Customer from "../models/Customer";
import Contact from "../models/Contact";

class ContactsController {
  // Listagem dos Contacts
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

    let where = { customer_id: req.params.customerId };
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

    const data = await Contact.findAll({
      where,
      include: [
        {
          model: Customer,
          attributes: ["id", "name", "status"],
          required: true,
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });
    return res.json(data);
  }

  // Recupera um Contact pelo id
  async show(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      include: [Customer],

      attributes: { exclude: ["customerId", "customer_id"] },
    });

    if (!contact) {
      return res.status(404).json();
    }
    return res.json(contact);
  }

  // Cria um novo Contact
  async create(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      status: yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Erro ao validar o squema" });
    }

    const contact = await Contact.create({
      customer_id: req.params.customerId,
      ...req.body,
    });

    return res.status(201).json(contact);
  }

  // Atualiza um Contact
  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      status: yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Erro ao validar o squema" });
    }

    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      attributes: { exclude: ["customerId", "customer_id"] },
    });

    if (!contact) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await contact.update(req.body);

    return res.json(contact);
  }

  // Exclui um Contact
  async destroy(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(404).json();
    }

    await contact.destroy();

    return res.json({ erro: "Cliente deletado com sucesso" });
  }
}

export default new ContactsController();
