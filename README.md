## Backend do teste para a vaga de dev FullStack na MaisEnvios

# Tecnologias utilizadas

- NestJs
- Typeorm
- Postgress
- Docker
- Jest
- RabbitMq

# Para rodar o projeto

### - Instale o NodeJs caso não o tenha instalado

- https://nodejs.dev/pt/learn/how-to-install-nodejs

### - Instale o docker e o docker-compose caso não os tenha instalados

- Para instalar o docker:
  ### https://docs.docker.com/engine/install/
- Para instalar docker-compose:
  ### https://docs.docker.com.zh.xy2401.com/v17.12/compose/install/

### - Instale a cli do NestJS caso não a tenha instalada:

- `npm install -g @nestjs/cli`

- ## Crie um arquivo .env e copie e cole os dados do .env.sample

### - Rode o comando `yarn start:dev`

- Ele irá fazer a instalação das dependencias, a criação do container com postgres e RabbitMq, após isso irá rodar as migrations e por fim irá iniciar o servidor na porta 3001 (ele pode ser acessado em http://localhost:3001)

## - Para rodar os testes

`yarn test:watch ` ou `yarn test`

## - Para acessar a documentação (swagger)

- `http://localhost:3001/docs`
