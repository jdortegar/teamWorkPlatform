#!/bin/bash
set -ex
echo Habla AI webapp - build-dist.sh -- Build the AWS EB-deployable .zip file
if [ $# -ne 1 ]
then
  echo "ERROR: please specify ONLY the name of the .zip to create"
else
  npm run build
  zip -r  $1-`git log -n 1 --pretty=%h`.zip * -x node_modules\* *.zip
  if [ -e ./.elasticbeanstalk/d.yml ]
  then
    rm ./.elasticbeanstalk/d.yml
  fi
  if [ -e ./.elasticbeanstalk/config.yml ]
  then
    rm ./.elasticbeanstalk/config.yml
  fi
  echo "deploy:" >> ./.elasticbeanstalk/d.yml
  echo "  artifact: ../"$1-`git log -n 1 --pretty=%h`.zip >> ./.elasticbeanstalk/d.yml
  cat ./.elasticbeanstalk/config.yml.src ./.elasticbeanstalk/d.yml >> ./.elasticbeanstalk/config.yml
fi

