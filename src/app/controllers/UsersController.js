import * as yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

import User from "../models/User";

import Queue from "../../lib/Queue";
import WelcomeEmailjob from "../jobs/WelcomeEmailjob";
// import DummyJob from "../jobs/DummyJob";

class UsersController {
  // Listagem dos User
  async index(req, res) {
    const {
      name,
      email,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = {};
    let order = [];

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

    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdBefore),
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

    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedAfter),
        },
      };
    }

    if (sort) {
      order = sort.split(",").map((item) => item.split(":"));
    }

    const data = await User.findAll({
      attributes: { exclude: ["password", "password_hash"] },
      where,
      order,
      limit,
      offset: limit * page - limit,
    });

    // ira ver o id do usuario que foi feito a requisição
    // console.log({ userId: req.userId });

    return res.json(data);
  }

  // lista de User
  async show(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "password_hash"] },
    });

    if (!user) {
      return res.status(404).json();
    }

    const { id, name, email, createdAt, updatedAt } = user;

    return res.json({ id, name, email, createdAt, updatedAt });
  }

  // criar um user
  async create(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(8),
      passwordConfirmation: yup
        .string()
        .when("password", (password, field) =>
          password ? field.required().oneOf([yup.ref("password")]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    // momento de criação
    const { id, name, email, file_id, createdAt, updatedAt } =
      await User.create(req.body);

    // await Queue.add(DummyJob.key, { message: "Olá Jobs" });
    // vai retornar o nome
    await Queue.add(WelcomeEmailjob.key, { name, email });

    return res
      .status(201)
      .json({ id, name, email, file_id, createdAt, updatedAt });
  }

  // atualizarum user
  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string().min(8),
      password: yup
        .string()
        .min(8)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: yup
        .string()
        // so entra nesse velificação se o oldPassword for requerido
        .when("password", (password, field) =>
          password ? field.required().oneOf([yup.ref("password")]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Erro ao validar o usuário" });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    const { oldPassword } = req.body;

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "user ou senha incorretos" });
    }

    const { id, name, email, file_id, createdAt, updatedAt } =
      await user.update(req.body);

    return res
      .status(201)
      .json({ id, name, email, file_id, createdAt, updatedAt });
  }

  // deletar um user
  async destroy(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    await user.destroy();

    return res.json({ error: "Usuário deletado com sucesso" });
  }
}

export default new UsersController();
