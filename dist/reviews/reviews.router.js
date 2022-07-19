"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
class ReviewRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
    }
    prepareOne(query) {
        return query.populate("user", "name").populate("restaurant");
    }
    applyRoutes(app) {
        app.get("/restaurants", this.findAll);
        app.get("/restaurants/:id", [this.validateId, this.findById]);
        app.post("/restaurants", this.save);
    }
}
exports.reviewsRouter = new ReviewRouter();
