#!/bin/sh
source /home/ec2-user/.bash_profile
export NODE_ENV=production
export PORT=80
npm run start:prod
exit 0
