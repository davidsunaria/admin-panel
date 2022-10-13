#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export HOME="/home/ubuntu/"

cd /var/www/html/dev-admin-ui
/usr/bin/yarn install && /usr/bin/yarn build:dev && cp -R ./build/* ./pro-build/

