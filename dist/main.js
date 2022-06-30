"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const server = new server_1.Server();
server
    .bootstrap([users_router_1.usersRouter])
    .then((server) => {
    console.log("Server is listening on: ", server.application.address());
})
    .catch((error) => {
    console.log("Server failed to start");
    console.log(error);
    process.exit(1);
});
// import * as restify from "restify";
// // instânciando o server
// const server = restify.createServer({
//   name: "meat-api",
//   version: "1.0.0",
// });
// // middlewares
// server.use(restify.plugins.queryParser());
// // podemos ter um array de callbacks, chamando a próxima utilizando a função next
// server.get("/info", [
//   (req, resp, next) => {
//     if (req.userAgent() && req.userAgent().includes("MSIE 7.0")) {
//       // resp.status(400);
//       // resp.json({ message: "Please, update your browser" });
//       let error: any = new Error();
//       error.statusCode = 400;
//       error.message = "Please, update our browser";
//       return next(error);
//       // return next(false); // não deixamos que a próxima callback seja chamada
//     }
//     return next();
//   },
//   (req, resp, next) => {
//     resp.json({
//       browser: req.userAgent(), // podemos verificar de qual browser a requisição foi feita
//       method: req.method, // verbo http utilizado
//       url: req.href(), // url
//       path: req.path(), // path
//       query: req.query, // parâmetros utilizados na url
//     });
//     return next();
//   },
// ]);
// server.get("/ping", (req, resp, next) => {
//   resp.json({ message: "pong" }); // por debaixo dos panos o json faz o seguinte:
//   resp.contentType = "application/json"; // definimos o content-type do header
//   resp.send({ message: "pong" }); // o método send não precisa passar o content-type
//   resp.setHeader("Content-Type", "application/json"); // outra maneira de definir o content-type do header
//   resp.status(400); // podemos setar o status code dessa requisição
//   return next();
// });
// // inicialização do servidor na porta 3000
// server.listen(3000, () => {
//   console.log("Server is listening on http://localhost:3000");
// });
