"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
exports.User = mongoose.model("User", userSchema);
