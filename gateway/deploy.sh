#ADD DSN ENV

sudo docker rm -f ajigateway

sudo docker pull smwest3/ajigateway

sudo docker run -d \
--network customNetwork
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-e TLSCERT=/etc/letsencrypt/live/ajidex.capstone.ischool.uw.edu/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/ajidex.capstone.ischool.uw.edu/privkey.pem \
-e SESSIONKEY="testSession" \
-e REDISADDR="redisServer:6379" \
-e RESTAURANTADDR="restaurants:5300" \
-p 443:443 \
--name ajigateway \
smwest3/ajigateway:latest

exit