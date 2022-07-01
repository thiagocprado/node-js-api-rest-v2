"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
class UserRouter extends router_1.Router {
    constructor() {
        super();
        this.on("beforeRender", (document) => {
            document.password = undefined;
        });
    }
    applyRoutes(app) {
        app.get("/users", (req, resp, next) => {
            users_model_1.User.find().then(this.render(resp, next));
        });
        app.get("/users/:id", (req, resp, next) => {
            users_model_1.User.findById(req.params.id).then(this.render(resp, next));
        });
        app.post("/users", (req, resp, next) => {
            let user = new users_model_1.User(req.body);
            user.save().then(this.render(resp, next));
        });
        app.put("/users/:id", (req, resp, next) => {
            const options = { overwrite: true }; // parâmetro para substituir o documento inteiro, se não por default ele substitui parcialmente
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec() // executa a query em si e nos permite usar promise
                .then((result) => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    return resp.send(404);
                }
            })
                .then(this.render(resp, next));
        });
        app.patch("/users/:id", (req, resp, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next));
        });
        app.del("/users/:id", (req, resp, next) => {
            users_model_1.User.remove({ _id: req.params.id })
                .exec()
                .then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    resp.send(404);
                }
                return next();
            });
        });
    }
}
// já exportamos a instância
exports.usersRouter = new UserRouter();
