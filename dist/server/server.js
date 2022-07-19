"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify"); // a configuração do restify não é baseada em promises
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
class Server {
    // inicia nosso banco de dados
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true,
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                // instaciamos o nosso servidor, mas deixamos ele dísponivel na aplicação
                this.application = restify.createServer({
                    name: "meat-api",
                    version: "1.0.0",
                });
                // middlewares
                this.application.use(restify.plugins.queryParser()); // deixa disponível em json os parâmetros passados nas url's atráves de req.query
                this.application.use(restify.plugins.bodyParser()); // transforma o body em json
                this.application.use(merge_patch_parser_1.mergePatchBodyParser); // dando suporte a outro content type
                // routes
                // iremos passar para cada rota individualmente a instância da nossa aplicação para que possamos dentro do arquivo da rota fazer sua inicialização
                for (const router of routers) {
                    router.applyRoutes(this.application);
                }
                // inicialização do servidor
                this.application.listen(environment_1.environment.server.port, () => {
                    // passa a diante a instância da nossa aplicação
                    resolve(this.application);
                });
                this.application.on("restifyError", error_handler_1.handleError);
            }
            catch (error) {
                // caso de erro já fazemos o reject
                reject(error);
            }
        });
    }
    // através do método bootstrap receberemos as rotas e depois o método apply routes fará a inicialização
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
