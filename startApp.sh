#!/bin/sh
source /home/ec2-user/.bash_profile
export NODE_ENV=production
export PORT=80
npm run build
node server.js&
exit 0
