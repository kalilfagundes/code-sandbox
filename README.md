# Farma-Alg 3.0 (sandbox)

Farma-Alg é um sistema para fins educacionais de lógica de programação e algorítmos. Seu propósito inicial é dar aos estudantes a possibilidade de executar códigos online com o feedback do resultado da execução de seu programa e, ao mesmo tempo, proporcionar ao professor um ferramental analítico para acompanhamento do aprendizado de suas turmas. A primeira versão deste software está em uso por alguns docentes do curso de Tecnologia em Análise e Desenvolvimento de Sistemas da Universidade Federal do Paraná (UFPR).

O propósito deste projeto é desenvolver uma evolução do Farma-Alg original, mantendo aspectos positivos e mitigando aspectos negativos da versão já em uso, levando em conta práticas atuais de mercado para o desenvolvimento de softwares escaláveis e de fácil manutenção. E, neste momento, o projeto está sendo desenvolvido como Trabalho de Conclusão de Curso e com o escopo um pouco reduzido em comparação ao projeto inicial.

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

Até o momento, a aplicação suporta códigos-fonte nas linguagens **C**, **Java (v11)**, **JavaScrippt (node)**, **Pascal (FPC)**, **PHP (v7.4)** e **Python (v3.8)**. Para incrementar o suporte a novas lingugens, é preciso adicionar um arquivo JSON com os metadados e arquivos *shell script* (.sh) à pasta `/scripts`.

## Formato de Requisição e da Resposta

Para fazer uso do serviço, é necessário enviar uma requisição HTTP do tipo `POST` para a raíz do serviço em execução (e.g. *localhost:4444*) com um JSON com a seguinte interface:

```ts
interface RequestBody {
  lang: 'c' | 'java' | 'js' | 'pascal' | 'php' | 'python'
  code: string
  params?: string[]
}
```

A resposta tem 3 formatos possíveis, e dependerá da quantidade de parâmetros de entrada que foram fornecidos na requisição e se houve algum problema no processo de compilação.

O objeto base  de resposta para cada execução é o `CodeRunOutput`:

```ts
interface CodeRunOutput {
  exit_code: number
  status: 'RUNTIME_ERROR' | 'SUCCESS'
  exec_time: number
  input: string | null
  output: string
}
```

Caso nçao seja fornecida a propriedade `"params"` ou esta seja passada como um *arrau* vazio, entende-se que o programa deve realizar uma única execução sem parâmetros de entrada, resultando em um único objeto `CodeRunOutout` na propriedade `"result"` de resposta. Logo, o JSON da resposta terá a seguinte tipagem:

```ts
interface CodeRun  {
  id: string
  status: 'COMPLETED'
  comp_time: number | null
  result: CodeRunOutput // <= um único objeto
}
```

Caso o cliente forneça um *array* para `"params"` de tamanho ***n***, a propriedade `"result"` também retornará um *array* de `CodeRunOutput` de tamanho ***n***, ficando a resposta com a seguinte tipagem:

```ts
interface CodeRun  {
  id: string
  status: 'COMPLETED'
  comp_time: number | null
  result: CodeRunOutput[] // <= uma execução para cada parâmetro de entrada
}
```

Em caso de erro de compilação e, portanto, nenhuma execução seja feita, a resposta não conterá a propriedade `"result"`, e sim, conterá a propriedade `"status": "COMPILATION_ERROR"` e a propriedade `"output"` diretamente no mesmo objeto:

```ts
interface CodeRun {
  id: string
  status: 'COMPILATION_ERROR'
  comp_time: number
  output: string
}
```
