#!/usr/bin/env bash
set -e

# Caminho do projeto
cd /opt/znuny/ApiQuestor_Znuny

# Atualiza código do repositório
git fetch --all
git reset --hard origin/main

# Caminho absoluto do pnpm (AJUSTE A VERSÃO SE PRECISAR)
PNPM=/root/.nvm/versions/node/v24.11.0/bin/pnpm

# Instala dependências
$PNPM install --frozen-lockfile

# Build (se existir)
$PNPM build || true

# Reinicia a API no PM2 ou cria se não existir
pm2 reload apiZnuny || pm2 start "$PNPM" --name apiZnuny --interpreter none -- start

# Salva estado do PM2
pm2 save
