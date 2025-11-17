📌 1. Preparar o Sistema
sudo apt update && sudo apt -y upgrade
sudo apt -y install git curl build-essential

⚙️ 2. Instalar Node.js (via NVM) e pnpm
Instalar o NVM
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # ou feche e reabra o terminal

Instalar Node LTS e definir como padrão
nvm install --lts
nvm use --lts

Habilitar Corepack e pnpm
corepack enable
corepack prepare pnpm@latest --activate

Verificar versões
node -v
pnpm -v


⚠️ Caso o Corepack não esteja disponível:

npm i -g pnpm

📦 3. Clonar o Projeto e Instalar Dependências
Criar diretório da aplicação
sudo mkdir -p /opt/znuny/apiQuestor
sudo chown -R $USER:$USER /opt/znuny/apiQuestor
cd /opt/znuny/apiQuestor

Clonar o repositório
git clone https://github.com/MichaelRoderjan/ApiQuestor_Znuny.git
# OU via SSH:
# git clone git@github.com:MichaelRoderjan/ApiQuestor_Znuny.git

Instalar dependências
pnpm install --frozen-lockfile
pnpm build || true   # caso exista processo de build

🔑 4. Configurar Variáveis de Ambiente (.env)

Crie ou edite o arquivo .env:

cp .envbackup .env   # se existir
nano .env


Preencha com os valores adequados:

CREATION_DATE=

# Email Responsável
EMAIL_USER=
EMAIL_PASS=

# Configuração do Servidor Questor
HOST_API=
PORT_API=
DATABASE_API=
USER_API=
PASSWORD_API=

# Configuração do Servidor PostgreSQL
HOST_POSTGRESQL=
PORT_POSTGRESQL=
DATABASE_POSTGRESQL=
USER_POSTGRESQL=
PASSWORD_POSTGRESQL=

🧪 5. Testar Localmente
pnpm install
pnpm start


Testar em outro terminal:

curl -i http://127.0.0.1:3000/


Para parar:

Ctrl + C

🚀 6. Executar em Background com PM2
pnpm setup
source ~/.bashrc
pnpm add -g pm2

Verificar caminho do pnpm
which pnpm

Iniciar API com PM2
pm2 start "pnpm start" --name apiznuny --interpreter bash

Salvar estado
pm2 save

Habilitar inicialização automática
pm2 startup systemd


Execute o comando exibido pelo PM2 após o startup (inicia com sudo env PATH=... pm2 startup).

Logs
pm2 logs apiznuny --lines 200

Remover aplicação
pm2 delete apiznuny

Status dos processos
pm2 status

🔁 7. Deploy / Atualização

Crie o script de deploy:

nano /var/www/minha-api/deploy.sh


Insira:

#!/usr/bin/env bash
set -e

cd /var/www/minha-api
git fetch --all
git reset --hard origin/main

pnpm install --frozen-lockfile
pnpm build || true

pm2 reload minha-api || pm2 start "pnpm start" --name minha-api --interpreter bash


Permitir execução:

chmod +x /var/www/minha-api/deploy.sh


Executar deploy:

./deploy.sh

🔍 8. Diagnóstico Rápido
Ver logs
pm2 logs minha-api

Reiniciar API
pm2 restart minha-api

Verificar portas
ss -lntp | grep node