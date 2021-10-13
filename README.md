# FarmaAlg 2.0 (sandbox)

FarmaALg é um sistema para fins educacionais de lógica de programação e algorítmos. Seu propósito inicial é dar aos estudantes a possibilidade de executar códigos online com o feedback do resultado da execução de seu programa e, ao mesmo tempo, proporcionar ao professor um ferramental analítico para acompanhamento do aprendizado de suas turmas. A primeira versão deste software está em uso por alguns docentes do curso de Tecnologia em Análise e Desenvolvimento de Sistemas da Universidade Federal do Paraná (UFPR).

O propósito deste projeto é desenvolver uma evolução do FarmaAlg original, mantendo aspectos positivos e mitigando aspectos negativos da versão já em uso, levando em conta práticas atuais de mercado para o desenvolvimento de softwares escaláveis e de fácil manutenção. E, neste momento, o projeto está sendo desenvolvido como Trabalho de Conclusão de Curso e com o escopo um pouco reduzido em comparação ao projeto inicial.

Ver protótipo em construção [nesta página](https://farmaalg.vercel.app/).

Este repositório se concentra no módulo sandbox, serviço dedicado à execução de códigos de terceiros em um ambiente virtualizado (contêiner [Docker](https://www.docker.com/)), executando um servidor em [Node.js](https://nodejs.org/) e interface de comunicação HTTP (API REST).

## Executar Projeto

Para executar a aplicação localmente, execute os seguintes comandos `npm` (requer SO **Linux** e **Node** instalado):

```bash
$ npm install     # baixar as dependências
$ npm run dev     # iniciar servidor de desenvolvimento
$ npm run build   # transpila código TypeScript para produção
$ npm start       # inicia aplicação de produção
```

Para executar a aplicação diretamente no container **Docker** (recomendado), execute os seguintes comandos:

```bash
$ docker-compose build   # cria o container com base no Dockerfile
$ docker-compose up      # inicia o container em modo de desenvolvimento

  # iniciar o serviço em modo de produção
$ docker-compose up -f docker-compose.yml -f docker-compose.prod.yml -d
```

## Linguagens SUportadas

Até o momento, a aplicação suporta códigos-fonte nas linguagens **C**, **JavaScrippt (node)** e **PHP (v7.4)**. Para incrementar o suporte a novas lingugens, é preciso adicionar um arquivo JSON com os metadados e arquivos *shell script* (.sh) à pasta `/scripts/`.

## Formato de Requisição

Para fazer uso do serviço, é necessário enviar uma requisição HTTP do tipo `POST` para a raíz do serviço em execução (e.g. *localhost:4444*) com um JSON com a seguinte interface:

```ts
interface RequestBody {
  lang: 'c' | 'js' | 'php'
  code: string
  params?: string[]
}
```

Se a requisição não contiver a propriedade `params` ou passá-la como um *arrau* vazio, o retorno será um único objeto com o resultado da execução. Mas caso se deseje executar o programa ***n*** vezes com oarâmetros de entrada diferentes, deve-se informar o valor de `params`, onde cada espaço contém os argumentos de uma execução. Logo a resposta será um *array* de tamanho ***n*** igualmente, com o resultado de cada execução com a seguinte interface:

```ts
interface CodeRun {
  source: string
  input: string | null      // 'null' caso a execução não possua parâmetros de entrada
  output: string
  comp_time: number | null  // 'null' caso a linguagem não seja compilada
  exec_time: number | null  // 'null' caso a linguagem falhou no processo decompilação
  exit_code: number
  status: 'DONE' | 'COMPILATION_ERROR' | 'EXECUTION_ERROR'
}
```
