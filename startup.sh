#!/bin/sh
dockerd-entrypoint.sh &> /usr/src/app/dockerlog.log &

#!/bin/sh
docker ps > /dev/null 2>&1
while [ $? != 0 ]
do
  docker ps > /dev/null 2>&1
done
echo "Docker started"
/usr/bin/node build/index.js
