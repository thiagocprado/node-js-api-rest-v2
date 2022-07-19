"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
class UserRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        // quando for acionado o evento, ele irá executar a função recebendo o document
        this.on("beforeRender", (document) => {
            document.password = undefined;
        });
    }
    applyRoutes(app) {
        app.get("/users", this.findAll);
        app.get("/users/:id", [this.validateId, this.findById]);
        app.del("/users/:id", [this.validateId, this.del]);
        app.patch("/users/:id", [this.validateId, this.update]);
        app.post("/users", this.save);
        app.put("/users/:id", [this.validateId, this.replace]);
    }
}
// já exportamos a instância
exports.usersRouter = new UserRouter();
