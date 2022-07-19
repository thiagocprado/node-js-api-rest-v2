"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
class RestaurantRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
                .then((rest) => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError("Resturant not found!");
                }
                else {
                    resp.json(rest.menu);
                    return next();
                }
            })
                .catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then((rest) => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError("Resturant not found!");
                }
                else {
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
    }
    applyRoutes(app) {
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
exports.restaurantsRouter = new RestaurantRouter();
