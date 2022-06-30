import * as restify from "restify";
import { Router } from "../common/router";
import { Users } from "./users.model";

class UserRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get("/users", (req, resp, next) => {
      Users.findAll().then((users) => {
        resp.json(users);
        return next();
      });
    });

    application.get("/users/:id", (req, resp, next) => {
      Users.findById(req.params.id).then((user) => {
        if (user) {
          resp.json(user);
          return next();
        }

        resp.send(404);
        return next();
      });
    });
  }
}

// já exportamos a instância
export const usersRouter = new UserRouter();
