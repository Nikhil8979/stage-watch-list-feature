#!/bin/bash
set -e


# Source the user's bash profile to load environment variables
# source ~/.bashrc
export PATH=$PATH:$(npm bin -g)

PROCESS_NAME="stage-backend"
cd /home/ubuntu/main-backend


tar -xzvf build.tar.gz -C .
rm -rf build.tar.gz

pnpm install

pnpm prisma generate

pnpm prisma migrate deploy || exit 1

pnpm run db:seed

if pm2 list | grep -q "backend"; then
echo "Process backend is running, reloading it..."
pm2 reload backend --update-env || exit 1
else
echo "Process backend is not running, starting it..."
pm2 start pnpm --name backend -- run start:prod || exit 1
fi

pm2 save
echo "Deployment finished"