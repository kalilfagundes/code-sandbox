# FarmaAlg 2.0 (sandbox)

FarmaALg é um sistema para fins educacionais de lógica de programação e algorítmos. Seu propósito inicial é dar aos estudantes a possibilidade de executar códigos online com o feedback do resultado da execução de seu programa e, ao mesmo tempo, proporcionar ao professor um ferramental analítico para acompanhamento do aprendizado de suas turmas. A primeira versão deste software está em uso por alguns docentes do curso de Tecnologia em Análise e Desenvolvimento de Sistemas da Universidade Federal do Paraná (UFPR).

O propósito deste projeto é desenvolver uma evolução do FarmaAlg original, mantendo aspectos positivos e mitigando aspectos negativos da versão já em uso, levando em conta práticas atuais de mercado para o desenvolvimento de softwares escaláveis e de fácil manutenção. E, neste momento, o projeto está sendo desenvolvido como Trabalho de Conclusão de Curso e com o escopo um pouco reduzido em comparação ao projeto inicial.

Ver protótipo em construção [nesta página](https://farmaalg.vercel.app/).

Este repositório se concentra no módulo sandbox, serviço dedicado à execução de códigos de terceiros em um ambiente virtualizado (contêiner [Docker](https://www.docker.com/)), executando um servidor em [Node.js](https://nodejs.org/) e interface de comunicação HTTP (API REST).

Para executar a aplicação no seu ambiente, dê as seguintes instruções em linha de comando na raís do projeto:

```bash
$ docker build . -t farma-alg/sandbox   # cria a imagem Docker da aplicação na máquina local
$ dockerdocker-compose up -d            # cria um contêiner baseado na imagem criada
```
