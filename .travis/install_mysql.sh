#!/bin/sh

# Pull and run the container
docker pull mysql:5.7
docker run \
    -d -p 127.0.0.1:3307:3306 \
    --name mysqld \
    -e MYSQL_DATABASE=today_test \
    -e MYSQL_USER=today \
    -e MYSQL_PASSWORD=today \
    -e MYSQL_ROOT_PASSWORD=root \
    mysql:5.7 \
    --innodb_log_file_size=256MB \
    --innodb_buffer_pool_size=512MB \
    --max_allowed_packet=16MB

cp .travis/docker.cnf ~/.my.cnf
mysql --print-defaults
