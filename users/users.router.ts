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

  applyRoutes(app: restify.Server) {
    app.get("/users", this.findAll);
    app.get("/users/:id", [this.validateId, this.findById]);
    app.del("/users/:id", [this.validateId, this.del]);
    app.patch("/users/:id", [this.validateId, this.update]);
    app.post("/users", this.save);
    app.put("/users/:id", [this.validateId, this.replace]);
  }
}

// já exportamos a instância
export const usersRouter = new UserRouter();
