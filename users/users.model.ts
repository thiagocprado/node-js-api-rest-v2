import * as mongoose from "mongoose";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

// o schama representa as propriedades do nosso documento, ou seja, quais informações ele irá armazernar
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
});

// O model irá nos permitir manipular nosso documento persistido no mongoDB
// deixaremos a variável com "U" maiusculo, pois ele contém métodos estáticos, facilitando essa visualização
export const User = mongoose.model<User>("User", userSchema);
