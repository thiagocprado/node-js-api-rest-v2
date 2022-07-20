"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
const authz_handler_1 = require("../security/authz.handler");
class ReviewRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
    }
    envelope(document) {
        const restId = document.restaurant._id
            ? document.restaurant._id
            : document.restaurant;
        let resource = super.envelope(document);
        resource._links.restaurant = `/restaurant/${restId}`;
        return resource;
    }
    applyRoutes(app) {
        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, [authz_handler_1.authorize("user"), this.save]);
    }
    prepareOne(query) {
        return query.populate("user", "name").populate("restaurant");
    }
}
exports.reviewsRouter = new ReviewRouter();
