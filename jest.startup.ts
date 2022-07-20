import * as jestCli from "jest-cli";
import { Server } from "./server/server";
import { environment } from "./common/environment";

import { User } from "./users/users.model";
import { Review } from "./reviews/reviews.model";

import { usersRouter } from "./users/users.router";
import { reviewsRouter } from "./reviews/reviews.router";
import { Restaurant } from "./restaurants/restaurants.model";
import { restaurantsRouter } from "./restaurants/restaurants.router";

let server: Server;
let address: string;

const beforeAllTests = () => {
  environment.db.url = process.env.DB_URL || "mongodb://localhost/db-test";
  environment.server.port = process.env.SERVER_PORT || 3001;
  address = `http://localhost:${environment.server.port}`;

  server = new Server();
  return server
    .bootstrap([usersRouter, reviewsRouter, restaurantsRouter])
    .then(() => User.remove({}).exec())
    .then(() => {
      let admin = new User();
      admin.name = "admin";
      admin.email = "admin@email.com";
      admin.password = "123456";
      admin.profiles = ["admin", "user"];
      return admin.save();
    })
    .then(() => Review.remove({}).exec())
    .then(() => Restaurant.remove({}).exec())
    .catch(console.error);
};

const afterAllTests = () => {
  return server.shutdown();
};

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
