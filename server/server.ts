import * as restify from "restify"; // a configuração do restify não é baseada em promises
import { environment } from "../common/environment";
import { Router } from "../common/router";

export class Server {
  application: restify.Server;

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // instaciamos o nosso servidor, mas deixamos ele dísponivel na aplicação
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0",
        });

        // middlewares
        this.application.use(restify.plugins.queryParser()); // deixa disponível em json os parâmetros passados nas url's atráves de req.query

        // routes
        // iremos passar para cada rota individualmente a instância da nossa aplicação para que possamos dentro do arquivo da rota fazer sua inicialização
        for (const router of routers) {
          router.applyRoutes(this.application);
        }

        // inicialização do servidor
        this.application.listen(environment.server.port, () => {
          // passa a diante a instância da nossa aplicação
          resolve(this.application);
        });
      } catch (error) {
        // caso de erro já fazemos o reject
        reject(error);
      }
    });
  }

  // através do método bootstrap receberemos as rotas e depois o método apply routes fará a inicialização
  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initRoutes(routers).then(() => this);
  }
}
