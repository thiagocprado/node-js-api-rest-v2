Executa aplicações javacript no lado do servidor

Arquitetura:
  - Libuv
  - V8 engine

  REPL: Repeat, Evaluate, Print, Loop -> Acessado pelo console do node. Para fazermos isso
  basta digitarmos "node" no console.


Restify:
  - Já tem uma implementação focadas em api's, já trabalhos com JSON por padrão. No express não trabalhamos com json por padrão. 
  
  - Tratamento de erros já focado em api's rest.
  - Já tem um suporte a hipermedia 

REST: Representational state transfer
  É um estilo arquitetural
  Sugere que esponhamos nossa api, como um conjunto de urls ou endereços que vão servir para localizar recurso. 

  Recurso é qualquer coisa que pode ter um nome dentro de uma aplicação

  requisitos para uma api rest:
  - Stateless: toda requisição vai conter todas as informações necessárias para ser processada, mesmo que já tenha sido feita uma requisição anterior.
  - Agnóstica a UI: não deve ter interface de usuário
  - Uniforme: 
    - identificar os recursos
    - representações(json, ...)
    - hypermedia

Mongo:
  - Orientado a documentos
  - schema livre/dinâmico
  - documentos: composto por chave e valor
    - chaves: case sensitive 
    - não pode conter chaves duplicadas
  - coleção: agrupas um conjunto de documentos 
    - dentro da coleção temos schemas dinâmicos

