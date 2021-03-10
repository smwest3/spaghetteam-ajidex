sudo docker rm -f ajiclient

sudo docker pull smwest3/ajiclient

sudo docker run -d \
-p 443:443 \
-p 80:80 \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
--name ajiclient \
smwest3/ajiclient:latest

exit
