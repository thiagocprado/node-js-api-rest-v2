import * as restify from "restify";
import { NotFoundError } from "restify-errors";
import { ModelRouter } from "../common/model-router";
import { Restaurant } from "./restaurants.model";

class RestaurantRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant);
  }

  findMenu = (req, resp, next) => {
    Restaurant.findById(req.params.id, "+menu")
      .then((rest) => {
        if (!rest) {
          throw new NotFoundError("Resturant not found!");
        } else {
          resp.json(rest.menu);
          return next();
        }
      })
      .catch(next);
  };

  replaceMenu = (req, resp, next) => {
    Restaurant.findById(req.params.id)
      .then((rest) => {
        if (!rest) {
          throw new NotFoundError("Resturant not found!");
        } else {
          rest.menu = req.body; // array de menuItem
          return rest.save();
        }
      })
      .then((rest) => {
        resp.json(rest.menu);
        return next();
      })
      .catch(next);
  };

  applyRoutes(app: restify.Server) {
    app.get("/restaurants", this.findAll);
    app.get("/restaurants/:id", [this.validateId, this.findById]);
    app.del("/restaurants/:id", [this.validateId, this.del]);
    app.patch("/restaurants/:id", [this.validateId, this.update]);
    app.post("/restaurants", this.save);
    app.put("/restaurants/:id", [this.validateId, this.replace]);

    app.get("/restaurants/:id/menu", [this.validateId, this.findMenu]);
    app.put("/restaurants/:id/menu", [this.validateId, this.replaceMenu]);
  }
}

export const restaurantsRouter = new RestaurantRouter();
