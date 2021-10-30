## Testes Automatizados

A aplicação está configurada com o **Jest** como framework para testes. Para executar os testes, basta dar o comando `npm test` na sua pr´p´ria máquina e um container de teste será montado e executado para, enfim, executar os testes dentro dele. O container de testes se baseia nos arquivos `docker-compose.yml` e `docker-compose.test.yml`.

Para execução dos testes, também, o Jest vai procurar todos os arquivos `*.ts` dentro da pasta `__tests__` e quaisquer arquivos `*.test.ts` e `*.spec.ts` que houver no projeto. Por isso, crie arquivos de testes seguindo este padrão. Para mais informações sobre as configurações do Jest, veja o arquivo [`/jest.config.ts`](../../jest.config.ts).
