import Bee from "bee-queue";

import DummyJob from "../app/jobs/DummyJob";
import WelcomeEmailjob from "../app/jobs/WelcomeEmailjob";

import redisConfig from "../config/redis";

const jobs = [DummyJob, WelcomeEmailjob];

class Queue {
  // filas de envio de emails
  constructor() {
    this.queue = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      // cada fila da sua execução ira ter um nojo job
      this.queue[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // metodo para criar um job dentro do redis
  add(queue, job) {
    return this.queue[queue].bee.createJob(job).save();
  }

  // metodo que processa a fila
  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queue[job.key];

      // evento de erro, que ira processar a função que esta dentro do DummyJob
      bee.on("failed", this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // se estiver em ambiente de desenvolvimente, emite console
    if (process.env.NODE_ENV === "development")
      console.error(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
