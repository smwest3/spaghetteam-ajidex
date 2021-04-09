sudo docker rm -f ajidb

sudo docker pull smwest3/ajidb

sudo docker run -d \
--network customnetwork \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-p 1433:1433 \
--name ajidb \
smwest3/ajidb:latest

exit
