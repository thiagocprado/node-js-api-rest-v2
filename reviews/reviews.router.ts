import * as restify from "restify";
import * as mongoose from "mongoose";
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";
import { authorize } from "../security/authz.handler";

class ReviewRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  envelope(document: any) {
    const restId = document.restaurant._id
      ? document.restaurant._id
      : document.restaurant;

    let resource = super.envelope(document);
    resource._links.restaurant = `/restaurant/${restId}`;

    return resource;
  }

  applyRoutes(app: restify.Server) {
    app.get(`${this.basePath}`, this.findAll);
    app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    app.post(`${this.basePath}`, [authorize("user"), this.save]);
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<Review, Review>
  ): mongoose.DocumentQuery<Review, Review> {
    return query.populate("user", "name").populate("restaurant");
  }
}

export const reviewsRouter = new ReviewRouter();
