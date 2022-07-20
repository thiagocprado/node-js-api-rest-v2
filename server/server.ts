import * as restify from "restify"; // a configuração do restify não é baseada em promises
import * as mongoose from "mongoose";
import * as fs from "fs";
import { logger } from "../common/logger";
import { environment as env } from "../common/environment";
import { Router } from "../common/router";
import { mergePatchBodyParser } from "./merge-patch.parser";
import { handleError } from "./error.handler";
import { tokenParser } from "../security/token.parser";

export class Server {
  application: restify.Server;

  // inicia nosso banco de dados
  initializeDb(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(env.db.url, {
      useMongoClient: true,
    });
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // instaciamos o nosso servidor, mas deixamos ele dísponivel na aplicação
        const options: restify.ServerOptions = {
          name: "meat-api",
          version: "1.0.0",
          log: logger,
        };

        if (env.security.enableHttps) {
          options.certificate = fs.readFileSync(env.security.certficate);
          options.key = fs.readFileSync(env.security.key);
        }

        this.application = restify.createServer(options);

        // logs
        this.application.pre(restify.plugins.requestLogger({ log: logger }));

        // middlewares
        this.application.use(restify.plugins.queryParser()); // deixa disponível em json os parâmetros passados nas url's atráves de req.query
        this.application.use(restify.plugins.bodyParser()); // transforma o body em json
        this.application.use(mergePatchBodyParser); // dando suporte a outro content type
        this.application.use(tokenParser); // tokenParser fica disponível em todo request

        // routes
        // iremos passar para cada rota individualmente a instância da nossa aplicação para que possamos dentro do arquivo da rota fazer sua inicialização
        for (const router of routers) {
          router.applyRoutes(this.application);
        }

        // inicialização do servidor
        this.application.listen(env.server.port, () => {
          // passa a diante a instância da nossa aplicação
          resolve(this.application);
        });

        this.application.on("restifyError", handleError);
      } catch (error) {
        // caso de erro já fazemos o reject
        reject(error);
      }
    });
  }

  // através do método bootstrap receberemos as rotas e depois o método apply routes fará a inicialização
  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initRoutes(routers).then(() => this)
    );
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close());
  }
}
