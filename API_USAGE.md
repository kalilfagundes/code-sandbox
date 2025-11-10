# Guia de Uso da API - Farma-Alg Sandbox

## Índice

1. [Introdução](#introdução)
2. [Autenticação](#autenticação)
3. [Endpoint de Execução](#endpoint-de-execução)
4. [Formato da Requisição](#formato-da-requisição)
5. [Formato da Resposta](#formato-da-resposta)
6. [Uso do Parâmetro `params`](#uso-do-parâmetro-params)
7. [Exemplos Práticos por Linguagem](#exemplos-práticos-por-linguagem)
8. [Gerenciamento da Instância](#gerenciamento-da-instância)
9. [Códigos de Status HTTP](#códigos-de-status-http)
10. [Exemplos com cURL](#exemplos-com-curl)
11. [Tratamento de Erros](#tratamento-de-erros)

---

## Introdução

O **Farma-Alg Sandbox** é uma API REST que permite executar códigos de programação em um ambiente isolado e seguro usando containers Docker. A API aceita código-fonte em diversas linguagens, compila (quando necessário) e executa o código, retornando o resultado da execução.

### Linguagens Suportadas

- **C** - Compilador GCC
- **Java (v11)** - OpenJDK 11
- **JavaScript** - Node.js
- **Pascal** - Free Pascal Compiler (FPC)
- **PHP (v7.4)** - PHP CLI
- **Python (v3.8)** - CPython 3.8

---

## Autenticação

A API utiliza autenticação via **API Key** no header `Authorization` usando o esquema Bearer.

### Como Autenticar

Inclua o header `Authorization` em todas as requisições POST:

```
Authorization: Bearer sua_api_key_aqui
```

### Configuração

A API Key deve ser configurada no arquivo `.env` do servidor:

```env
API_KEY="sua_api_key_secreta_aqui"
```

**Importante:** Se a variável `API_KEY` não estiver configurada no servidor, a autenticação será **opcional** e a API aceitará requisições sem o header Authorization.

---

## Endpoint de Execução

### POST /

Endpoint principal para compilar e executar código.

**URL:** `POST http://localhost:4444/`

**Headers Obrigatórios:**
- `Content-Type: application/json`
- `Authorization: Bearer <sua_api_key>` (se configurada no servidor)

---

## Formato da Requisição

```typescript
interface RequestBody {
  lang: 'c' | 'java' | 'js' | 'pascal' | 'php' | 'python'
  code: string
  params?: string[]
}
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `lang` | string | Sim | Identificador da linguagem de programação |
| `code` | string | Sim | Código-fonte a ser executado |
| `params` | string[] | Não | Array de strings com parâmetros de entrada (stdin) |

---

## Formato da Resposta

A API pode retornar três tipos de resposta diferentes, dependendo do resultado da compilação e execução:

### 1. Execução Única (sem parâmetros ou params vazio)

Quando `params` não é fornecido ou é um array vazio, o código é executado uma única vez sem entrada.

```typescript
interface CodeRun {
  id: string
  status: 'COMPLETED'
  comp_time: number | null
  result: CodeRunOutput
}

interface CodeRunOutput {
  exit_code: number
  status: 'RUNTIME_ERROR' | 'SUCCESS'
  exec_time: number
  input: string | null
  output: string
}
```

**Exemplo de resposta:**

```json
{
  "id": "a1b2c3d4",
  "status": "COMPLETED",
  "comp_time": 245,
  "result": {
    "exit_code": 0,
    "status": "SUCCESS",
    "exec_time": 12,
    "input": null,
    "output": "hello, there!\n"
  }
}
```

### 2. Múltiplas Execuções (com params)

Quando `params` contém um ou mais elementos, o código é executado para cada conjunto de entrada.

```typescript
interface CodeRun {
  id: string
  status: 'COMPLETED'
  comp_time: number | null
  result: CodeRunOutput[]  // Array de resultados
}
```

**Exemplo de resposta:**

```json
{
  "id": "a1b2c3d4",
  "status": "COMPLETED",
  "comp_time": 245,
  "result": [
    {
      "exit_code": 0,
      "status": "SUCCESS",
      "exec_time": 12,
      "input": "5 3\nthere\n",
      "output": "5 + 3 should be 8\nhello, there!\n"
    },
    {
      "exit_code": 0,
      "status": "SUCCESS",
      "exec_time": 10,
      "input": "-3 10\nJosnei\n",
      "output": "-3 + 10 should be 7\nhello, Josnei!\n"
    }
  ]
}
```

### 3. Erro de Compilação

Quando há erro na compilação, a resposta não contém `result`.

```typescript
interface CodeRun {
  id: string
  status: 'COMPILATION_ERROR'
  comp_time: number
  output: string
}
```

**Exemplo de resposta:**

```json
{
  "id": "a1b2c3d4",
  "status": "COMPILATION_ERROR",
  "comp_time": 123,
  "output": "error: expected ';' before '}' token\n"
}
```

---

## Uso do Parâmetro `params`

O parâmetro `params` permite testar seu código com diferentes conjuntos de entrada (stdin), simulando múltiplos casos de teste.

### Execução Sem Entrada

Omita o parâmetro `params` ou envie um array vazio `[]` quando o código não precisa ler dados da entrada padrão.

```json
{
  "lang": "python",
  "code": "print('Hello, World!')",
  "params": []
}
```

### Execução com Um Conjunto de Entrada

Forneça um array com uma string contendo os dados de entrada:

```json
{
  "lang": "python",
  "code": "name = input()\nprint(f'Hello, {name}!')",
  "params": ["Maria"]
}
```

### Execução com Múltiplos Conjuntos de Entrada

Forneça um array com várias strings. O código será executado uma vez para cada elemento:

```json
{
  "lang": "python",
  "code": "name = input()\nprint(f'Hello, {name}!')",
  "params": ["Maria", "João", "Ana"]
}
```

### Entrada Multilinhas

Use `\n` para separar linhas de entrada:

```json
{
  "lang": "python",
  "code": "nome = input()\nidade = input()\nprint(f'{nome} tem {idade} anos')",
  "params": ["Carlos\n25", "Beatriz\n30"]
}
```

**Importante:** Sempre termine entradas com `\n` quando seu código espera ler múltiplas linhas.

---

## Exemplos Práticos por Linguagem

### C

#### Exemplo 1: Código Simples (sem entrada)

**Requisição:**

```json
{
  "lang": "c",
  "code": "#include <stdio.h>\n\nvoid main() {\n  printf(\"hello, there!\\n\");\n}"
}
```

**Resposta:**

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": 245,
  "result": {
    "exit_code": 0,
    "status": "SUCCESS",
    "exec_time": 12,
    "input": null,
    "output": "hello, there!\n"
  }
}
```

#### Exemplo 2: Código com Entrada

**Requisição:**

```json
{
  "lang": "c",
  "code": "#include <stdlib.h>\n#include <stdio.h>\n\nvoid main()\n{\n  int num1, num2;\n  scanf(\"%d %d\", &num1, &num2);\n  printf(\"%d + %d should be %d\\n\", num1, num2, num1 + num2);\n\n  char str[255];\n  scanf(\"%s\", str);\n  printf(\"hello, %s!\\n\", str);\n}",
  "params": [
    "5 3\nthere\n",
    "-3 10\nJosnei\n"
  ]
}
```

**Resposta:**

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": 250,
  "result": [
    {
      "exit_code": 0,
      "status": "SUCCESS",
      "exec_time": 15,
      "input": "5 3\nthere\n",
      "output": "5 + 3 should be 8\nhello, there!\n"
    },
    {
      "exit_code": 0,
      "status": "SUCCESS",
      "exec_time": 14,
      "input": "-3 10\nJosnei\n",
      "output": "-3 + 10 should be 7\nhello, Josnei!\n"
    }
  ]
}
```

---

### Java

#### Exemplo 1: Código Simples (sem entrada)

**Requisição:**

```json
{
  "lang": "java",
  "code": "class FarmaAlg {\n  public static void main(String[] args) {\n    String greeting = \"hello\";\n    String name = \"there\";\n    System.out.println(greeting + \", \" + name + \"!\");\n  }\n}"
}
```

**Resposta:**

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": 1200,
  "result": {
    "exit_code": 0,
    "status": "SUCCESS",
    "exec_time": 85,
    "input": null,
    "output": "hello, there!\n"
  }
}
```

#### Exemplo 2: Código com Entrada

**Requisição:**

```json
{
  "lang": "java",
  "code": "import java.util.Scanner;\n\nclass FarmaAlg {\n  public static void main(String[] args) throws Exception {\n    try (Scanner scanner = new Scanner(System.in)) {\n      int num1 = scanner.nextInt();\n      int num2 = scanner.nextInt();\n      int sum = num1 + num2;\n      System.out.println(num1 + \" + \" + num2 + \" should be \" + sum);\n\n      String name = scanner.next();\n      System.out.println(\"hello, \" + name + \"!\");\n    } catch (Exception ex) {\n      throw ex;\n    }\n  }\n}",
  "params": [
    "5 3\nthere\n",
    "-3 10\nJosnei\n"
  ]
}
```

---

### JavaScript

#### Exemplo 1: Código Simples (sem entrada)

**Requisição:**

```json
{
  "lang": "js",
  "code": "const x = 'there';\nconsole.log(`hello, ${x}!`);"
}
```

**Resposta:**

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": null,
  "result": {
    "exit_code": 0,
    "status": "SUCCESS",
    "exec_time": 45,
    "input": null,
    "output": "hello, there!\n"
  }
}
```

#### Exemplo 2: Código com Entrada

**Requisição:**

```json
{
  "lang": "js",
  "code": "let inputString = ''\nlet currentLine = 0\n\nprocess.stdin.on('data', (input) => {\n  inputString += input\n})\n\nprocess.stdin.on('end', () => {\n  inputString = inputString\n    .trim()\n    .split('\\n')\n    .map((line) => line.trim())\n\n  main()\n})\n\nfunction readline() {\n  return inputString[currentLine++]\n}\n\nfunction main() {\n  let input = readline()\n  const [num1, num2] = input.split(' ').map(Number)\n  console.log(`${num1} + ${num2} should be ${num1 + num2}`)\n\n  input = readline()\n  console.log(`hello, ${input}!`)\n}",
  "params": [
    "5 3\nthere\n",
    "-3 10\nJosnei\n"
  ]
}
```

---

### Pascal

#### Exemplo 1: Código Simples (sem entrada)

**Requisição:**

```json
{
  "lang": "pascal",
  "code": "program farma_alg;\n\nvar\n  greeting : string;\n  text     : string;\n\nbegin\n  greeting := 'hello';\n  text := 'there';\n  writeln(greeting, ', ', text, '!');\nend."
}
```

#### Exemplo 2: Código com Entrada

**Requisição:**

```json
{
  "lang": "pascal",
  "code": "program farma_alg;\n\nvar\n  num1 : integer;\n  num2 : integer;\n  sum  : integer;\n  text : string;\n\nbegin\n  readln(num1, num2);\n  sum := num1 + num2;\n  writeln(num1, ' + ', num2, ' should be ', sum);\n\n  readln(text);\n  writeln('hello, ', text, '!');\nend.",
  "params": [
    "5 3\nthere\n",
    "-3 10\nJosnei\n"
  ]
}
```

---

### PHP

#### Exemplo 1: Código Simples (sem entrada)

**Requisição:**

```json
{
  "lang": "php",
  "code": "<?php\n\n$var = 'there';\necho \"hello, $var!\\n\";"
}
```

**Resposta:**

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": null,
  "result": {
    "exit_code": 0,
    "status": "SUCCESS",
    "exec_time": 22,
    "input": null,
    "output": "hello, there!\n"
  }
}
```

#### Exemplo 2: Código com Entrada

**Requisição:**

```json
{
  "lang": "php",
  "code": "<?php\n\nfunction main() {\n  $input = readline();\n  [$num1, $num2] = explode(' ', $input);\n  $sum = $num1 + $num2;\n  echo \"$num1 + $num2 should be $sum\\n\";\n\n  $input = readline();\n  echo \"hello, $input!\\n\";\n}\n\nmain();",
  "params": [
    "5 3\nthere\n",
    "-3 10\nJosnei\n"
  ]
}
```

---

### Python

#### Exemplo 1: Código Simples (sem entrada)

**Requisição:**

```json
{
  "lang": "python",
  "code": "var = 'there';\nprint('hello, {}!'.format(var))"
}
```

**Resposta:**

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": null,
  "result": {
    "exit_code": 0,
    "status": "SUCCESS",
    "exec_time": 35,
    "input": null,
    "output": "hello, there!\n"
  }
}
```

#### Exemplo 2: Código com Entrada

**Requisição:**

```json
{
  "lang": "python",
  "code": "def main():\n  num1, num2 = input().split()\n  sum = int(num1) + int(num2)\n  print('{} + {} should be {}'.format(num1, num2, sum))\n\n  text = input()\n  print('hello, {}!'.format(text))\n\nmain()",
  "params": [
    "5 3\nthere\n",
    "-3 10\nJosnei\n"
  ]
}
```

---

## Gerenciamento da Instância

### Como Manter a Instância Viva

A instância do servidor permanece ativa enquanto o processo estiver em execução. Cada requisição é processada de forma independente e isolada em um novo container Docker.

### Timeout e Limites de Execução

O servidor possui limites configuráveis para evitar execuções infinitas:

- **`SANDBOX_TIMEOUT`**: Tempo máximo de execução em milissegundos (padrão: 10000ms = 10s)
- Se o código exceder o timeout, a execução será interrompida e retornará erro

**Exemplo de código com timeout:**

```json
{
  "lang": "c",
  "code": "#include <stdlib.h>\n#include <stdio.h>\n\nvoid main()\n{\n  int i = 1;\n  while (1) {\n    i++;\n  }\n}\n",
  "params": []
}
```

**Resposta:**

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": 250,
  "result": {
    "exit_code": 124,
    "status": "RUNTIME_ERROR",
    "exec_time": 10000,
    "input": null,
    "output": ""
  }
}
```

### Boas Práticas de Uso

1. **Validação no Cliente**: Valide o código no lado do cliente antes de enviar para evitar requisições desnecessárias
2. **Reutilização de Conexão**: Use keep-alive HTTP para melhor performance em múltiplas requisições
3. **Tratamento de Erros**: Sempre trate os diferentes tipos de resposta (SUCCESS, RUNTIME_ERROR, COMPILATION_ERROR)
4. **Limitação de Requisições**: Implemente rate limiting no cliente para evitar sobrecarga do servidor
5. **Casos de Teste**: Use o array `params` para executar múltiplos casos de teste em uma única requisição
6. **Segurança da API Key**: Nunca exponha sua API key no código front-end. Use um servidor intermediário

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| **200 OK** | Requisição processada com sucesso (mesmo com erro de compilação ou runtime) |
| **400 Bad Request** | Erro de validação nos dados enviados (campo obrigatório faltando, linguagem não suportada, etc.) |
| **401 Unauthorized** | API key não fornecida, inválida ou formato incorreto |
| **500 Internal Server Error** | Erro interno do servidor |

**Importante:** Erros de compilação e execução retornam status **200 OK** com detalhes do erro no corpo da resposta.

---

## Exemplos com cURL

### Exemplo 1: Requisição Simples

```bash
curl -X POST http://localhost:4444/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sua_api_key_aqui" \
  -d '{
    "lang": "python",
    "code": "print(\"Hello, World!\")"
  }'
```

### Exemplo 2: Requisição com Múltiplos Casos de Teste

```bash
curl -X POST http://localhost:4444/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sua_api_key_aqui" \
  -d '{
    "lang": "python",
    "code": "n = int(input())\nprint(n * 2)",
    "params": ["5", "10", "15"]
  }'
```

### Exemplo 3: Requisição com Entrada Multilinhas

```bash
curl -X POST http://localhost:4444/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sua_api_key_aqui" \
  -d '{
    "lang": "c",
    "code": "#include <stdio.h>\n\nvoid main() {\n  int a, b;\n  scanf(\"%d %d\", &a, &b);\n  printf(\"%d\\n\", a + b);\n}",
    "params": ["5 3\n", "10 20\n"]
  }'
```

---

## Tratamento de Erros

### Erro de Autenticação (401)

```json
{
  "error": "API key inválida."
}
```

**Solução:** Verifique se a API key está correta e configurada no servidor.

### Erro de Validação (400)

```json
{
  "errors": [
    "Property 'lang' is mandatory.",
    "Property 'code' is mandatory."
  ]
}
```

**Solução:** Certifique-se de enviar todos os campos obrigatórios.

```json
{
  "errors": [
    "Language ID 'ruby' is not supported."
  ]
}
```

**Solução:** Use uma das linguagens suportadas: `c`, `java`, `js`, `pascal`, `php`, `python`.

### Erro de Compilação (200 OK)

```json
{
  "id": "...",
  "status": "COMPILATION_ERROR",
  "comp_time": 123,
  "output": "Main.java:3: error: ';' expected\n    System.out.println(\"hello\")\n                                ^\n1 error\n"
}
```

**Solução:** Corrija os erros de sintaxe no código.

### Erro de Execução (200 OK)

```json
{
  "id": "...",
  "status": "COMPLETED",
  "comp_time": null,
  "result": {
    "exit_code": 1,
    "status": "RUNTIME_ERROR",
    "exec_time": 25,
    "input": null,
    "output": "Traceback (most recent call last):\n  File \"main.py\", line 1, in <module>\n    print(x)\nNameError: name 'x' is not defined\n"
  }
}
```

**Solução:** Corrija os erros lógicos ou de runtime no código.

---

## Suporte

Para mais informações sobre o projeto Farma-Alg, visite o [repositório no GitHub](https://github.com/kalilfagundes/code-sandbox).

**Licença:** MIT

