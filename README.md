<div align="center">

# API Questor / Znuny

API REST para consultar contatos, administrar contas de e-mail e usuários e enviar mensagens por SMTP.

![Node.js](https://img.shields.io/badge/Node.js-runtime-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-banco_de_dados-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-cache-DC382D?logo=redis&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-7.0-22B573)
![License](https://img.shields.io/badge/licen%C3%A7a-ISC-blue)

</div>

> [!WARNING]
> O estado atual do projeto expõe credenciais em algumas respostas HTTP e não implementa autenticação ou autorização. Consulte [Segurança](#seguranca) antes de publicar a API.

<a id="sumario"></a>
## 📑 Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação](#instalacao)
- [Configuração](#configuracao)
- [Uso da API](#uso-da-api)
- [Estrutura de diretórios](#estrutura-de-diretorios)
- [Segurança](#seguranca)
- [Solução de problemas](#solucao-de-problemas)
- [Licença](#licenca)

<a id="sobre-o-projeto"></a>
## 🧭 Sobre o projeto

A API Questor / Znuny é uma aplicação Node.js com Express que reúne quatro responsabilidades:

- consulta contatos em uma base PostgreSQL externa e mantém o resultado em cache no Redis;
- envia e-mails, inclusive com anexos em Base64, pelo servidor SMTP do SMTP2GO;
- mantém usuários e contas de e-mail em outra conexão PostgreSQL, criando as tabelas necessárias sob demanda;
- disponibiliza variáveis de credenciais utilizadas por integrações Tareffa e por contas de e-mail.

A aplicação usa CommonJS, recebe JSON e formulários com limite de `30mb` e, por padrão, escuta a porta `3000`. Não há interface web, processo de build, migrações independentes ou suíte de testes implementada.

<a id="funcionalidades"></a>
## ✨ Funcionalidades

- Consulta de contatos com filtro por código do usuário (`user`) e limite opcional.
- Cache das consultas de contatos no Redis, com opção de ignorá-lo.
- Envio SMTP para um ou vários destinatários.
- Suporte a anexos recebidos como conteúdo Base64.
- Cadastro, consulta e exclusão de usuários.
- Cadastro, consulta por identificador ou grupo e exclusão de contas de e-mail.
- Associação entre usuários e contas de e-mail.
- Criação automática das tabelas `emails` e `usuarios` quando determinadas operações são executadas.
- Endpoint de verificação simples com a data configurada para a API.

<a id="tecnologias"></a>
## 🧰 Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js / CommonJS | Ambiente de execução |
| Express 5 | Servidor HTTP e rotas REST |
| PostgreSQL (`pg`) | Persistência de usuários/e-mails e consulta de contatos |
| Redis | Cache de contatos |
| Nodemailer | Envio de e-mails por SMTP2GO |
| dotenv | Leitura do arquivo `.env` |
| CORS | Liberação de requisições entre origens |

O projeto também declara `body-parser` e `node-firebird` como dependências, mas eles não são importados pelo código atual.

<a id="requisitos"></a>
## 📋 Requisitos

- Node.js compatível com as dependências do projeto e npm; recomenda-se uma versão LTS atual.
- PostgreSQL acessível para:
  - armazenar as tabelas `emails` e `usuarios`;
  - consultar a tabela/view `pex_cadastroestab_contato`.
- Redis acessível para o cache de contatos.
- Conta SMTP2GO válida para envio de e-mails.
- Permissão do usuário PostgreSQL operacional para executar `CREATE TABLE`, `SELECT`, `INSERT` e `DELETE`.

> Não há versão de Node.js fixada em `.nvmrc`, `package.json` ou outro arquivo do repositório.

<a id="instalacao"></a>
## 🚀 Instalação

1. Clone o repositório e entre no diretório:

   ```bash
   git clone https://github.com/MichaelRoderjan/ApiQuestor_Znuny.git
   cd ApiQuestor_Znuny
   ```

2. Instale as dependências usando um dos lockfiles versionados:

   ```bash
   npm ci
   ```

   Alternativamente, com pnpm:

   ```bash
   pnpm install --frozen-lockfile
   ```

3. Crie um arquivo `.env` na raiz e preencha as variáveis descritas em [Configuração](#configuracao).

4. Certifique-se de que PostgreSQL e Redis estejam acessíveis.

5. Inicie a API:

   ```bash
   npm start
   ```

6. Verifique a execução:

   ```bash
   curl http://localhost:3000/
   ```

Não execute `npm test` como validação: o script atual apenas informa que nenhum teste foi especificado e termina com erro.

<a id="configuracao"></a>
## ⚙️ Configuração

Crie `.env` na raiz. Use valores próprios; nunca versione credenciais reais.

```dotenv
# Aplicação
PORT=3000
CREATION_DATE=01/01/2026

# PostgreSQL: usuários e contas de e-mail
HOST_API=localhost
PORT_API=5432
DATABASE_API=api_questor
USER_API=api_user
PASSWORD_API=troque_esta_senha

# PostgreSQL: origem dos contatos
HOST_POSTGRESQL=localhost
PORT_POSTGRESQL=5432
DATABASE_POSTGRESQL=contatos
USER_POSTGRESQL=consulta_user
PASSWORD_POSTGRESQL=troque_esta_senha

# Redis — estes são os nomes efetivamente lidos pelo código
HOST_REDIS=127.0.0.1
PORT_REDIS=6379
PASSWORD_REDIS=troque_esta_senha
REDIS_CACHE_EXPIRATION=3600

# Credencial de e-mail devolvida pelo endpoint /api/emails_senha
EMAIL_USER=usuario_de_exemplo
EMAIL_PASS=troque_esta_senha

# Credenciais devolvidas pelo endpoint /tareffa
TAREFFA_CLIENT_ID=cliente_exemplo
TAREFFA_CLIENT_SECRET=troque_este_segredo
TAREFFA_USERNAME=usuario_exemplo
TAREFFA_PASSWORD=troque_esta_senha
USERLOGIN=login_exemplo
PASSWORD=troque_esta_senha
CERT_USER=certificado_exemplo
CERT_PASSWORD=troque_esta_senha
```

### Bancos de dados

`HOST_API` e variáveis relacionadas alimentam a conexão usada pelas rotas `/api/usuarios` e `/api/emails`. As tabelas abaixo são criadas automaticamente durante algumas operações:

- `emails`: `id_email`, `email`, `senha`, `grupo` e `criado_em`;
- `usuarios`: `id_usuario`, `login`, `grupo`, `id_email` e `criado_em`.

`HOST_POSTGRESQL` e variáveis relacionadas apontam para a origem de `/contatos`. Essa base já deve conter `pex_cadastroestab_contato` e todas as colunas consultadas pelo controller.

### Redis

O Redis é conectado durante a inicialização. Sem ele, a consulta de contatos não funciona. `REDIS_CACHE_EXPIRATION` é passado ao Redis como tempo de expiração em segundos e deve ser um inteiro positivo.

O `.env` existente historicamente usa nomes como `REDIS_HOST`, `REDIS_PORT` e `REDIS_PASSWORD`, mas o código lê `HOST_REDIS`, `PORT_REDIS` e `PASSWORD_REDIS`. Use os nomes mostrados no exemplo acima ou ajuste o código antes de implantar.

### SMTP2GO

O envio usa de forma fixa:

- host: `mail.smtp2go.com`;
- porta: `465`;
- conexão segura: TLS implícito (`secure: true`).

As credenciais SMTP são recebidas em cada requisição nos campos `email` e `password`; `EMAIL_USER` e `EMAIL_PASS` não são usados diretamente no envio.

### Tareffa

O projeto não chama uma API Tareffa. O endpoint `/tareffa` apenas lê e devolve as oito variáveis indicadas no exemplo. Há ainda a chave `TAFEFFA_CLIENT_ID` nos arquivos locais, aparentemente um erro de digitação; ela não é lida pelo código.

<a id="uso-da-api"></a>
## 📖 Uso da API

Base local: `http://localhost:3000`.

### Rotas principais

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Retorna uma mensagem HTML com `CREATION_DATE` |
| `GET` | `/contatos` | Consulta contatos, usando Redis |
| `GET` | `/tareffa` | Retorna credenciais Tareffa configuradas |
| `POST` | `/enviar-email` | Envia e-mail pelo SMTP2GO |
| `POST` | `/api/usuarios` | Cadastra um usuário |
| `GET` | `/api/usuarios` | Lista usuários |
| `GET` | `/api/usuarios/:login` | Busca usuários pelo login |
| `DELETE` | `/api/usuarios/:id` | Exclui um usuário |
| `GET` | `/api/emails/usuario/:login` | Retorna e-mail e senha associados ao usuário |
| `GET` | `/api/emails/usuario/:login/senha` | Retorna login, e-mail e senha associados |
| `POST` | `/api/emails` | Cadastra uma conta de e-mail |
| `GET` | `/api/emails` | Lista contas de e-mail |
| `GET` | `/api/emails_senha` | Retorna `EMAIL_USER` e `EMAIL_PASS` |
| `GET` | `/api/emails/:login` | Busca pelo `id_email` apesar do nome do parâmetro |
| `GET` | `/api/emails/grupo/:grupo` | Lista contas por grupo |
| `DELETE` | `/api/emails/:id` | Exclui uma conta de e-mail |

#### Consultar contatos

```bash
curl "http://localhost:3000/contatos?user=123&limit=10"
```

Parâmetros opcionais:

- `user`: filtra exatamente por `cod_tareffa`;
- `limit`: limita a quantidade de registros quando maior que zero;
- `ignoreCache=true`: ignora uma entrada já armazenada e atualiza o cache.

A resposta indica `origem` como `redis` ou `postgresql` e inclui os registros em `dados`.

#### Enviar e-mail

```bash
curl -X POST http://localhost:3000/enviar-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["destinatario@exemplo.com"],
    "subject": "Assunto de exemplo",
    "text": "Conteúdo da mensagem",
    "email": "remetente@exemplo.com",
    "password": "senha-smtp-de-exemplo",
    "attachments": [
      {
        "filename": "documento.txt",
        "content": "Q29udGXDumRvIGRlIGV4ZW1wbG8=",
        "encoding": "base64",
        "contentType": "text/plain"
      }
    ]
  }'
```

`to` aceita uma string ou uma lista. `attachments` é opcional; cada item válido precisa de `filename` e `content`.

#### Cadastrar conta e usuário

Cadastre primeiro a conta de e-mail:

```bash
curl -X POST http://localhost:3000/api/emails \
  -H "Content-Type: application/json" \
  -d '{"email":"conta@exemplo.com","senha":"senha-de-exemplo","grupo":"fiscal"}'
```

Use o `id_email` retornado para associar o usuário:

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"login":"usuario.exemplo","grupo":"fiscal","id_email":1}'
```

<a id="estrutura-de-diretorios"></a>
## 🗂️ Estrutura de diretórios

```text
.
├── src/
│   ├── config/
│   │   └── redisClient.js       # Cliente e conexão Redis
│   ├── controllers/             # Regras das respostas HTTP
│   ├── database/
│   │   ├── connection.js        # Pool PostgreSQL operacional
│   │   └── createTable.js       # Criação de emails e usuarios
│   ├── models/                  # Acesso a dados e credenciais
│   ├── routes/                  # Definição das rotas Express
│   ├── utils/
│   │   └── formatDateTime.js    # Formatador de data/hora
│   └── app.js                   # Middlewares e rotas raiz
├── server.js                    # Inicialização e rotas sob /api
├── package.json                 # Metadados, scripts e dependências
├── package-lock.json            # Lockfile do npm
├── pnpm-lock.yaml               # Lockfile do pnpm
└── README.md
```

`src/routes/tareffaRoutes.js`, `src/utils/formatDateTime.js`, `body-parser` e `node-firebird` existem, mas não participam do fluxo carregado atualmente.

<a id="seguranca"></a>
## 🔒 Segurança

O projeto requer endurecimento antes de ser exposto fora de uma rede controlada:

- **Ausência de autenticação:** todas as rotas são públicas, inclusive cadastro e exclusão.
- **Exposição crítica de segredos:** `/tareffa`, `/api/emails_senha` e rotas de consulta de usuários/e-mails devolvem senhas ou tokens.
- **Senhas em texto puro:** a coluna `emails.senha` não aplica hash ou criptografia.
- **Credenciais SMTP no corpo:** o cliente envia usuário e senha a cada operação; HTTPS é obrigatório.
- **Logs de anexos:** o conteúdo recebido e formatado é escrito no console, podendo registrar documentos inteiros.
- **CORS irrestrito:** `cors()` aceita qualquer origem.
- **Payload elevado:** JSON e formulários aceitam até `30mb`, o que aumenta o risco de abuso de recursos.
- **Sem limitação de requisições e validação mínima:** não há rate limiting, autenticação, esquema de validação ou sanitização específica.
- **Detalhes de erro:** `/contatos` devolve `error.message`, que pode revelar informações internas.
- **Arquivo sensível versionado:** `.envBackup` está rastreado pelo Git e não é ignorado. Remova segredos reais do arquivo e do histórico Git, rotacione-os e adote um `.env.example` sem valores reais.

Antes da produção, proteja ou remova endpoints de credenciais, restrinja o CORS, use HTTPS, valide entradas, aplique autorização por função, limite requisições e armazene segredos em um cofre apropriado. Nunca envie o `.env` ao repositório.

<a id="solucao-de-problemas"></a>
## 🛠️ Solução de problemas

### A API não inicia e exibe erro do Redis

Confirme se o serviço está ativo e se foram usadas as variáveis `HOST_REDIS`, `PORT_REDIS` e `PASSWORD_REDIS`. O código tenta conectar ao Redis assim que o módulo é carregado.

### `/contatos` retorna HTTP 500

Verifique:

- acesso ao PostgreSQL definido por `HOST_POSTGRESQL`;
- existência de `pex_cadastroestab_contato` e das colunas consultadas;
- acesso ao Redis;
- valor inteiro positivo em `REDIS_CACHE_EXPIRATION`.

Use `?ignoreCache=true` para forçar uma nova consulta quando suspeitar de dados desatualizados.

### Rotas de usuários ou e-mails falham

Valide as variáveis terminadas em `_API` e as permissões para criar e manipular tabelas. A exclusão de um e-mail referenciado mantém o usuário e define `id_email` como `NULL`.

### O envio SMTP falha

Confira se a conta está autorizada no SMTP2GO, se a saída para `mail.smtp2go.com:465` está liberada e se `email` e `password` foram enviados. Anexos devem conter Base64 válido quando `encoding` não for informado.

### `GET /api/emails/:login` não busca pelo login

Apesar do nome da rota e do parâmetro, a implementação consulta `id_email`. Informe um identificador numérico ou corrija a implementação em uma evolução futura.

### Alterações no `.env` não aparecem

Reinicie o processo Node.js. As variáveis são carregadas durante a inicialização.

<a id="licenca"></a>
## 📄 Licença

O `package.json` declara a licença **ISC**. Entretanto, não há um arquivo `LICENSE` no repositório; inclua o texto integral da licença antes da publicação para tornar os termos explícitos.
