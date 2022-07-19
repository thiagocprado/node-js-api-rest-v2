import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { environment } from "../common/environment";
import { validateCPF } from "../common/validators";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

// o schama representa as propriedades do nosso documento, ou seja, quais informações ele irá armazernar
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female"],
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: "{PATH}: Invalid CPF ({VALUE})",
    },
  },
});

const hashPassword = (obj, next) => {
  bcrypt
    .hash(obj.password, environment.security.saltRounds)
    .then((hash) => {
      obj.password = hash;
      next();
    })
    .catch(next);
};

const saveMiddleware = function (next) {
  const user: User = this;

  if (!user.isModified("password")) {
    next();
  } else {
    hashPassword(user, next);
  }
};

const updateMiddleware = function (next) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
};

// middleware que será executada antes de realizar o save ou o update
userSchema.pre("save", saveMiddleware);
userSchema.pre("findOneAndUpdate", updateMiddleware);
userSchema.pre("update", updateMiddleware);

// O model irá nos permitir manipular nosso documento persistido no mongoDB
// deixaremos a variável com "U" maiusculo, pois ele contém métodos estáticos, facilitando essa visualização
export const User = mongoose.model<User>("User", userSchema);
