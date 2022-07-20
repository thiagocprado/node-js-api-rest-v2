import * as restify from "restify";
import { ModelRouter } from "../common/model-router";
import { User } from "./users.model";
import { authenticate } from "../security/auth.handler";
import { authorize } from "../security/authz.handler";

class UserRouter extends ModelRouter<User> {
  constructor() {
    super(User);

    // quando for acionado o evento, ele irá executar a função recebendo o document
    this.on("beforeRender", (document) => {
      document.password = undefined;
    });
  }

  findByEmail = (req, resp, next) => {
    if (req.query.email) {
      User.findByEmail(req.query.email)
        .then((user) => (user ? [user] : []))
        .then(
          this.renderAll(resp, next, { pageSize: this.pageSize, url: req.url })
        )
        .catch(next);
    } else {
      next();
    }
  };

  applyRoutes(app: restify.Server) {
    app.get({ path: `${this.basePath}`, version: "1.0.0" }, [
      authorize("admin"),
      this.findAll,
    ]);
    app.get({ path: `${this.basePath}`, version: "2.0.0" }, [
      authorize("admin"),
      this.findByEmail,
      this.findAll,
    ]);
    app.get(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.findById,
    ]);
    app.del(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.del,
    ]);
    app.patch(`${this.basePath}/:id`, [
      authorize("admin"), // seria necessário uma função para validar se o id do usuário é o mesmo que ele vai alterar
      this.validateId,
      this.update,
    ]);
    app.post(`${this.basePath}`, [authorize("admin"), this.save]);
    app.put(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.replace,
    ]);

    app.post(`${this.basePath}/authenticate`, authenticate);
  }
}

// já exportamos a instância
export const usersRouter = new UserRouter();
