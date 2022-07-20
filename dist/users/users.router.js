"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UserRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then((user) => (user ? [user] : []))
                    .then(this.renderAll(resp, next, { pageSize: this.pageSize, url: req.url }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        // quando for acionado o evento, ele irá executar a função recebendo o document
        this.on("beforeRender", (document) => {
            document.password = undefined;
        });
    }
    applyRoutes(app) {
        app.get({ path: `${this.basePath}`, version: "1.0.0" }, [
            authz_handler_1.authorize("admin"),
            this.findAll,
        ]);
        app.get({ path: `${this.basePath}`, version: "2.0.0" }, [
            authz_handler_1.authorize("admin"),
            this.findByEmail,
            this.findAll,
        ]);
        app.get(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.findById,
        ]);
        app.del(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.del,
        ]);
        app.patch(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.update,
        ]);
        app.post(`${this.basePath}`, [authz_handler_1.authorize("admin"), this.save]);
        app.put(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.replace,
        ]);
        app.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
// já exportamos a instância
exports.usersRouter = new UserRouter();
