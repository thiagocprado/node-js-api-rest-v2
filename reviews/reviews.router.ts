import * as restify from "restify";
import * as mongoose from "mongoose";
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";

class ReviewRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<Review, Review>
  ): mongoose.DocumentQuery<Review, Review> {
    return query.populate("user", "name").populate("restaurant");
  }

  applyRoutes(app: restify.Server) {
    app.get("/restaurants", this.findAll);
    app.get("/restaurants/:id", [this.validateId, this.findById]);
    app.post("/restaurants", this.save);
  }
}

export const reviewsRouter = new ReviewRouter();
