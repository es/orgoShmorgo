#!/usr/bin/env bash
apt-get update
apt-get install -y nginx vim git-core

# Setting up nginx
rm /etc/nginx/sites-enabled/default
cp /vagrant/dev/nginxConfig /etc/nginx/sites-enabled/
sed -i 's/sendfile on;/sendfile off;/g' /etc/nginx/nginx.conf
service nginx restart
