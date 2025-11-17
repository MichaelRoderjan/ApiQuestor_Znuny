🧩 1. Conectar e preparar o sistema
sudo apt update && sudo apt -y upgrade
sudo apt -y install git curl build-essential

⚙️ 2. Instalar Node (via nvm) e pnpm
Instalar NVM
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # ou feche/abra o terminal

Instalar Node LTS e definir como padrão
nvm install --lts
nvm use --lts

Habilitar Corepack e pnpm
corepack enable
corepack prepare pnpm@latest --activate

Checar versões
node -v
pnpm -v


Caso corepack não exista, instale manualmente:

npm i -g pnpm

📦 3. Clonar e instalar sua API
sudo mkdir -p /opt/znuny/apiQuestor
sudo chown -R $USER:$USER /opt/znuny/apiQuestor
cd /opt/znuny/apiQuestor


Clone o repositório:

git clone https://github.com/MichaelRoderjan/ApiQuestor_Znuny.git
# ou via SSH:
# git clone git@github.com:MichaelRoderjan/ApiQuestor_Znuny.git


Instale dependências:

pnpm install --frozen-lockfile
pnpm build || true    # apenas se houver processo de build

🔑 4. Variáveis de ambiente

Crie/edite o arquivo .env:

cp .envbackup .env   # se existir
nano .env

Cole o conteúdo abaixo no .env:
CREATION_DATE=07/11/25

# Email responsável para envio de e-mails
EMAIL_USER=fiscal@roderjan.com.br
EMAIL_PASS=MSfeMh2SiYEzR6LK

# Configuração do banco local Znuny
HOST_API='192.168.124.213'
PORT_API='5432'
DATABASE_API='znuny10'
USER_API='znunyuser'
PASSWORD_API='Otr#025HH'

# Configuração do servidor PostgreSQL do Questor
HOST_POSTGRESQL='192.168.124.197'
PORT_POSTGRESQL='5432'
DATABASE_POSTGRESQL='questor'
USER_POSTGRESQL='USER_ZNUNY'
PASSWORD_POSTGRESQL='V5}Z4.Z5V5}Z4.Z5'

🧪 5. Testar localmente
pnpm install
pnpm start


Teste em outro terminal:

curl -i http://127.0.0.1:3000/


Para parar:

Ctrl + C

🚀 6. Rodar em background com PM2
pnpm setup
source /root/.bashrc
pnpm add -g pm2

Descobrir caminho do pnpm
which pnpm

Iniciar a API via PM2
pm2 start "pnpm start" --name apiznuny --interpreter bash

Salvar estado do PM2
pm2 save

Habilitar no boot
pm2 startup systemd


Execute o comando que o PM2 mostrar após isso (começa com sudo env PATH=... pm2 startup).

Logs
pm2 logs apiznuny --lines 200

Caso precise deletar a API
pm2 delete minha-api

Checar status
pm2 status

🔁 7. Atualizar (deploy futuro)

Crie o script:

nano /var/www/minha-api/deploy.sh


Cole:

#!/usr/bin/env bash
set -e
cd /var/www/minha-api
git fetch --all
git reset --hard origin/main
pnpm install --frozen-lockfile
pnpm build || true
pm2 reload minha-api || pm2 start "pnpm start" --name minha-api --interpreter bash


Permissão:

chmod +x /var/www/minha-api/deploy.sh


Rodar deploy:

./deploy.sh

🔍 8. Diagnóstico rápido

Ver logs:

pm2 logs minha-api


Reiniciar app:

pm2 restart minha-api


Ver portas:

ss -lntp | grep node