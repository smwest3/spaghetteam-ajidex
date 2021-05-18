#ADD DSN ENV

sudo docker rm -f ajigateway

sudo docker pull smwest3/ajigateway

sudo docker run -d \
--network customnetwork \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-e TLSCERT=/etc/letsencrypt/live/ajidex.capstone.ischool.uw.edu/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/ajidex.capstone.ischool.uw.edu/privkey.pem \
-e SESSIONKEY="testSession" \
-e REDISADDR="redisServer:6379" \
-e RESTAURANTADDR="restaurants:5300" \
-e DIETADDR="diets:5400" \
-e DSN="sqlserver://sa:C0d3-aj1d3x@172.18.0.2:1433?database=ajidexdb&connectiontimeout=0" \
-p 5000:5000 \
--name ajigateway \
smwest3/ajigateway:latest

exit