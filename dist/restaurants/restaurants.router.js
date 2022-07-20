"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
const authz_handler_1 = require("../security/authz.handler");
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
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(app) {
        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
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
        app.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        app.put(`${this.basePath}/:id/menu`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.replaceMenu,
        ]);
    }
}
exports.restaurantsRouter = new RestaurantRouter();
