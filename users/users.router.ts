import * as restify from "restify";
import { ModelRouter } from "../common/model-router";
import { User } from "./users.model";

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
    app.get({ path: `${this.basePath}`, version: "1.0.0" }, this.findAll);
    app.get({ path: `${this.basePath}`, version: "2.0.0" }, [
      this.findByEmail,
      this.findAll,
    ]);
    app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    app.del(`${this.basePath}/:id`, [this.validateId, this.del]);
    app.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
    app.post(`${this.basePath}`, this.save);
    app.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
  }
}

// já exportamos a instância
export const usersRouter = new UserRouter();
