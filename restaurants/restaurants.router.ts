import * as restify from "restify";
import { NotFoundError } from "restify-errors";
import { ModelRouter } from "../common/model-router";
import { Restaurant } from "./restaurants.model";
import { authorize } from "../security/authz.handler";

class RestaurantRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant);
  }

  envelope(document: any) {
    let resource = super.envelope(document);
    resource._links.menu = `${this.basePath}/${resource._id}/menu`;

    return resource;
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
    app.get(`${this.basePath}`, this.findAll);
    app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    app.del(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.del,
    ]);
    app.patch(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.update,
    ]);
    app.post(`${this.basePath}`, [authorize("admin"), this.save]);
    app.put(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.replace,
    ]);

    app.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
    app.put(`${this.basePath}/:id/menu`, [
      authorize("admin"),
      this.validateId,
      this.replaceMenu,
    ]);
  }
}

export const restaurantsRouter = new RestaurantRouter();
