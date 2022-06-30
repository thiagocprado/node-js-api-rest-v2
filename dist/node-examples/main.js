"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fatorial_1 = require("./fatorial");
const argv = require("yargs").demandOption("num").argv; // mostra os argumentos sendo utilizados na linha de comando
const num = argv.num;
console.log("n-fatorial");
console.log(`O fatorial de ${num} é igual a ${fatorial_1.fatorial(num)}`);
// console.log(`Executando o script a partir do diretório ${process.cwd()}`);
// a partir do process temos acesso a eventos
// process.on("exit", () => {
//   console.log("script está prestes a terminar");
// });
// através do objeto process podemos pegar informações sobre o ambiente de execução
