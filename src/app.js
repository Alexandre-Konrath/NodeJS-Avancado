import "dotenv/config";

import express from "express";
// um retorno melhor do erro
import * as Sentry from "@sentry/node";

import Youch from "youch";
import "express-async-errors";

// import authMiddleware from "./app/middlewares/auth";
import routes from "./routes";

import "./database";

import sentryConfig from "./config/sentry";

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // colocar antes de chamar qualquer middlewares
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    // this.server.use(authMiddleware);
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // tratamento de
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      // se nao estiver em desenvolvimento ele retorna em um outro erro
      if (process.env.NODE_ENV === "development") {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: "Erro do Servidor Interno." });
    });
  }
}

export default new App().server;
